-- =============================================
-- TravelMate Community Features Database Schema
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);

-- =============================================
-- 2. COMMUNITY POSTS (Q&A Forum)
-- =============================================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- visa, packing, safety, budget, transport, food, culture, general
  tags TEXT[] DEFAULT '{}',
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);

-- =============================================
-- 3. POST REPLIES (Answers)
-- =============================================
CREATE TABLE IF NOT EXISTS community_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  is_best_answer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_replies_post ON community_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_user ON community_replies(user_id);

-- =============================================
-- 4. COMMUNITY PHOTOS
-- =============================================
CREATE TABLE IF NOT EXISTS community_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  location TEXT,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  likes INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_photos_user ON community_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_community_photos_destination ON community_photos(destination_id);
CREATE INDEX IF NOT EXISTS idx_community_photos_created ON community_photos(created_at DESC);

-- =============================================
-- 5. TRAVEL MEETUPS
-- =============================================
CREATE TABLE IF NOT EXISTS meetups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  max_travelers INT DEFAULT 10,
  current_travelers INT DEFAULT 1,
  status TEXT DEFAULT 'open', -- open, closed, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meetups_user ON meetups(user_id);
CREATE INDEX IF NOT EXISTS idx_meetups_destination ON meetups(destination);
CREATE INDEX IF NOT EXISTS idx_meetups_dates ON meetups(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_meetups_status ON meetups(status);

-- =============================================
-- 6. MEETUP PARTICIPANTS
-- =============================================
CREATE TABLE IF NOT EXISTS meetup_participants (
  meetup_id UUID REFERENCES meetups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (meetup_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_meetup_participants_meetup ON meetup_participants(meetup_id);
CREATE INDEX IF NOT EXISTS idx_meetup_participants_user ON meetup_participants(user_id);

-- =============================================
-- 7. GENERIC LIKES SYSTEM
-- =============================================
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- trip, blog, photo, post, reply
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_community_likes_user ON community_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_item ON community_likes(item_type, item_id);

-- =============================================
-- 8. GENERIC COMMENTS SYSTEM
-- =============================================
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- trip, blog, photo
  item_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_user ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_item ON community_comments(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created ON community_comments(created_at DESC);

-- =============================================
-- 9. POST/REPLY VOTES (Separate tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS community_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- post, reply
  item_id UUID NOT NULL,
  vote_type TEXT NOT NULL, -- upvote, downvote
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_community_votes_user ON community_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_votes_item ON community_votes(item_type, item_id);

-- =============================================
-- 10. USER ACTIVITY FEED
-- =============================================
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- shared_trip, posted_photo, asked_question, answered_question, created_meetup
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activities_user ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created ON user_activities(created_at DESC);

-- =============================================
-- 11. SAVED ITEMS (Bookmarks)
-- =============================================
CREATE TABLE IF NOT EXISTS saved_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- trip, photo, post, meetup
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_items_user ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_item ON saved_items(item_type, item_id);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetup_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- User Follows Policies
CREATE POLICY "Anyone can view follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON user_follows FOR DELETE USING (auth.uid() = follower_id);

-- Community Posts Policies
CREATE POLICY "Anyone can view posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Community Replies Policies
CREATE POLICY "Anyone can view replies" ON community_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON community_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own replies" ON community_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON community_replies FOR DELETE USING (auth.uid() = user_id);

-- Community Photos Policies
CREATE POLICY "Anyone can view photos" ON community_photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload photos" ON community_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own photos" ON community_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own photos" ON community_photos FOR DELETE USING (auth.uid() = user_id);

-- Meetups Policies
CREATE POLICY "Anyone can view open meetups" ON meetups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create meetups" ON meetups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meetups" ON meetups FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meetups" ON meetups FOR DELETE USING (auth.uid() = user_id);

-- Meetup Participants Policies
CREATE POLICY "Anyone can view participants" ON meetup_participants FOR SELECT USING (true);
CREATE POLICY "Users can join meetups" ON meetup_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave meetups" ON meetup_participants FOR DELETE USING (auth.uid() = user_id);

-- Likes Policies
CREATE POLICY "Anyone can view likes" ON community_likes FOR SELECT USING (true);
CREATE POLICY "Users can like items" ON community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike items" ON community_likes FOR DELETE USING (auth.uid() = user_id);

-- Comments Policies
CREATE POLICY "Anyone can view comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON community_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON community_comments FOR DELETE USING (auth.uid() = user_id);

-- Votes Policies
CREATE POLICY "Anyone can view votes" ON community_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON community_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change vote" ON community_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove vote" ON community_votes FOR DELETE USING (auth.uid() = user_id);

-- Activities Policies
CREATE POLICY "Anyone can view activities" ON user_activities FOR SELECT USING (true);
CREATE POLICY "System can create activities" ON user_activities FOR INSERT WITH CHECK (true);

-- Saved Items Policies
CREATE POLICY "Users can view own saved items" ON saved_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save items" ON saved_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave items" ON saved_items FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update reply count on posts
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET reply_count = reply_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET reply_count = reply_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_reply_count
AFTER INSERT OR DELETE ON community_replies
FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

-- Function to update comment count on photos
CREATE OR REPLACE FUNCTION update_photo_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.item_type = 'photo' THEN
    UPDATE community_photos SET comment_count = comment_count + 1 WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' AND OLD.item_type = 'photo' THEN
    UPDATE community_photos SET comment_count = comment_count - 1 WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_photo_comment_count
AFTER INSERT OR DELETE ON community_comments
FOR EACH ROW EXECUTE FUNCTION update_photo_comment_count();

-- Function to update meetup participant count
CREATE OR REPLACE FUNCTION update_meetup_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'accepted' THEN
    UPDATE meetups SET current_travelers = current_travelers + 1 WHERE id = NEW.meetup_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'accepted' THEN
    UPDATE meetups SET current_travelers = current_travelers - 1 WHERE id = OLD.meetup_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    UPDATE meetups SET current_travelers = current_travelers + 1 WHERE id = NEW.meetup_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status != 'accepted' AND OLD.status = 'accepted' THEN
    UPDATE meetups SET current_travelers = current_travelers - 1 WHERE id = NEW.meetup_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_meetup_participant_count
AFTER INSERT OR UPDATE OR DELETE ON meetup_participants
FOR EACH ROW EXECUTE FUNCTION update_meetup_participant_count();

-- =============================================
-- HELPER VIEWS
-- =============================================

-- View for user stats
CREATE OR REPLACE VIEW user_community_stats AS
SELECT 
  p.id as user_id,
  p.full_name,
  p.avatar_url,
  (SELECT COUNT(*) FROM user_follows WHERE following_id = p.id) as followers_count,
  (SELECT COUNT(*) FROM user_follows WHERE follower_id = p.id) as following_count,
  (SELECT COUNT(*) FROM trips WHERE user_id = p.id AND is_public = true) as shared_trips_count,
  (SELECT COUNT(*) FROM community_posts WHERE user_id = p.id) as posts_count,
  (SELECT COUNT(*) FROM community_photos WHERE user_id = p.id) as photos_count,
  (SELECT COUNT(*) FROM community_replies WHERE user_id = p.id) as replies_count
FROM profiles p;

COMMENT ON TABLE user_follows IS 'Social graph for user following relationships';
COMMENT ON TABLE community_posts IS 'Q&A forum posts and travel tips';
COMMENT ON TABLE community_replies IS 'Answers and replies to community posts';
COMMENT ON TABLE community_photos IS 'User-uploaded travel photos';
COMMENT ON TABLE meetups IS 'Travel meetup events';
COMMENT ON TABLE community_likes IS 'Generic likes for any content type';
COMMENT ON TABLE community_comments IS 'Generic comments for any content type';
COMMENT ON TABLE community_votes IS 'Upvotes/downvotes for posts and replies';
COMMENT ON TABLE user_activities IS 'Activity feed for user actions';
COMMENT ON TABLE saved_items IS 'User bookmarks/saved items';
