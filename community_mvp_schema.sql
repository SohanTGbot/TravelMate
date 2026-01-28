-- =============================================
-- TravelMate Community MVP - Minimal Schema
-- =============================================
-- This is a focused schema for MVP features only:
-- - Shared Trips Feed
-- - User Profiles
-- - Trip Interactions (like, save, comment)
-- - Follow System
-- =============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USER FOLLOWS (Social Graph)
-- =============================================
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);

-- =============================================
-- 2. COMMUNITY LIKES (Generic for all content)
-- =============================================
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- trip, blog, photo, etc.
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_community_likes_user ON community_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_item ON community_likes(item_type, item_id);

-- =============================================
-- 3. COMMUNITY COMMENTS (Generic for all content)
-- =============================================
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- trip, blog, photo, etc.
  item_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_user ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_item ON community_comments(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created ON community_comments(created_at DESC);

-- =============================================
-- 4. SAVED ITEMS (Bookmarks)
-- =============================================
CREATE TABLE IF NOT EXISTS saved_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- trip, photo, post, etc.
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_items_user ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_item ON saved_items(item_type, item_id);

-- =============================================
-- 5. ENHANCE TRIPS TABLE (Add social counts)
-- =============================================
-- Add social interaction counts to existing trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS comments_count INT DEFAULT 0;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS saves_count INT DEFAULT 0;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_trips_is_public ON trips(is_public);
CREATE INDEX IF NOT EXISTS idx_trips_likes_count ON trips(likes_count DESC);

-- =============================================
-- 6. ENHANCE PROFILES TABLE (Add social info)
-- =============================================
-- Add bio and social counts to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS followers_count INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS following_count INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trips_shared_count INT DEFAULT 0;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- User Follows Policies
CREATE POLICY "Anyone can view follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON user_follows FOR DELETE USING (auth.uid() = follower_id);

-- Likes Policies
CREATE POLICY "Anyone can view likes" ON community_likes FOR SELECT USING (true);
CREATE POLICY "Users can like items" ON community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike items" ON community_likes FOR DELETE USING (auth.uid() = user_id);

-- Comments Policies
CREATE POLICY "Anyone can view comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON community_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON community_comments FOR DELETE USING (auth.uid() = user_id);

-- Saved Items Policies
CREATE POLICY "Users can view own saved items" ON saved_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save items" ON saved_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave items" ON saved_items FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update comment count on trips
CREATE OR REPLACE FUNCTION update_trip_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.item_type = 'trip' THEN
    UPDATE trips SET comments_count = comments_count + 1 WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' AND OLD.item_type = 'trip' THEN
    UPDATE trips SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trip_comment_count
AFTER INSERT OR DELETE ON community_comments
FOR EACH ROW EXECUTE FUNCTION update_trip_comment_count();

-- Function to update like count on trips
CREATE OR REPLACE FUNCTION update_trip_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.item_type = 'trip' THEN
    UPDATE trips SET likes_count = likes_count + 1 WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' AND OLD.item_type = 'trip' THEN
    UPDATE trips SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trip_like_count
AFTER INSERT OR DELETE ON community_likes
FOR EACH ROW EXECUTE FUNCTION update_trip_like_count();

-- Function to update save count on trips
CREATE OR REPLACE FUNCTION update_trip_save_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.item_type = 'trip' THEN
    UPDATE trips SET saves_count = saves_count + 1 WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' AND OLD.item_type = 'trip' THEN
    UPDATE trips SET saves_count = GREATEST(0, saves_count - 1) WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trip_save_count
AFTER INSERT OR DELETE ON saved_items
FOR EACH ROW EXECUTE FUNCTION update_trip_save_count();

-- Function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_follower_counts
AFTER INSERT OR DELETE ON user_follows
FOR EACH ROW EXECUTE FUNCTION update_follower_counts();

-- Function to update trips shared count
CREATE OR REPLACE FUNCTION update_trips_shared_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_public = true THEN
    UPDATE profiles SET trips_shared_count = trips_shared_count + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.is_public = true AND OLD.is_public = false THEN
    UPDATE profiles SET trips_shared_count = trips_shared_count + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.is_public = false AND OLD.is_public = true THEN
    UPDATE profiles SET trips_shared_count = GREATEST(0, trips_shared_count - 1) WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' AND OLD.is_public = true THEN
    UPDATE profiles SET trips_shared_count = GREATEST(0, trips_shared_count - 1) WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trips_shared_count
AFTER INSERT OR UPDATE OR DELETE ON trips
FOR EACH ROW EXECUTE FUNCTION update_trips_shared_count();

-- =============================================
-- HELPER VIEWS
-- =============================================

-- View for user stats (useful for profiles)
CREATE OR REPLACE VIEW user_community_stats AS
SELECT 
  p.id as user_id,
  p.full_name,
  p.avatar_url,
  p.bio,
  p.created_at as joined_at,
  COALESCE(p.followers_count, 0) as followers_count,
  COALESCE(p.following_count, 0) as following_count,
  COALESCE(p.trips_shared_count, 0) as trips_shared_count,
  (SELECT COUNT(*) FROM community_comments WHERE user_id = p.id) as comments_count,
  (SELECT COUNT(*) FROM community_likes WHERE user_id = p.id) as likes_given_count
FROM profiles p;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE user_follows IS 'Social graph for user following relationships';
COMMENT ON TABLE community_likes IS 'Generic likes for any content type (trips, photos, posts, etc.)';
COMMENT ON TABLE community_comments IS 'Generic comments for any content type';
COMMENT ON TABLE saved_items IS 'User bookmarks/saved items';

COMMENT ON COLUMN trips.likes_count IS 'Number of likes on this trip';
COMMENT ON COLUMN trips.comments_count IS 'Number of comments on this trip';
COMMENT ON COLUMN trips.saves_count IS 'Number of times this trip was saved/bookmarked';
COMMENT ON COLUMN trips.views_count IS 'Number of views on this trip';

COMMENT ON COLUMN profiles.bio IS 'User bio/description for public profile';
COMMENT ON COLUMN profiles.followers_count IS 'Number of users following this user';
COMMENT ON COLUMN profiles.following_count IS 'Number of users this user is following';
COMMENT ON COLUMN profiles.trips_shared_count IS 'Number of public trips shared by this user';

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Uncomment to add sample follows for testing
-- INSERT INTO user_follows (follower_id, following_id) 
-- SELECT p1.id, p2.id 
-- FROM profiles p1, profiles p2 
-- WHERE p1.id != p2.id 
-- LIMIT 10
-- ON CONFLICT DO NOTHING;

-- =============================================
-- END OF MVP SCHEMA
-- =============================================
