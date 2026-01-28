import { supabase } from './supabase';

// =============================================
// TYPES
// =============================================

export interface CommunityPost {
    id: string;
    user_id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    upvotes: number;
    downvotes: number;
    reply_count: number;
    view_count: number;
    is_resolved: boolean;
    created_at: string;
    updated_at: string;
    user?: {
        full_name: string;
        avatar_url: string;
    };
}

export interface CommunityReply {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    upvotes: number;
    downvotes: number;
    is_best_answer: boolean;
    created_at: string;
    user?: {
        full_name: string;
        avatar_url: string;
    };
}

export interface CommunityPhoto {
    id: string;
    user_id: string;
    image_url: string;
    caption: string;
    location: string;
    destination_id?: string;
    likes: number;
    comment_count: number;
    created_at: string;
    user?: {
        full_name: string;
        avatar_url: string;
    };
}

export interface Meetup {
    id: string;
    user_id: string;
    title: string;
    destination: string;
    start_date: string;
    end_date: string;
    description: string;
    max_travelers: number;
    current_travelers: number;
    status: 'open' | 'closed' | 'completed' | 'cancelled';
    created_at: string;
    user?: {
        full_name: string;
        avatar_url: string;
    };
}

export interface Comment {
    id: string;
    user_id: string;
    item_type: string;
    item_id: string;
    content: string;
    created_at: string;
    user?: {
        full_name: string;
        avatar_url: string;
    };
}

// =============================================
// USER FOLLOWS
// =============================================

export const communityService = {
    // Follow a user
    async followUser(followingId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('user_follows')
            .insert({ follower_id: user.id, following_id: followingId });

        if (error) throw error;
    },

    // Unfollow a user
    async unfollowUser(followingId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('user_follows')
            .delete()
            .eq('follower_id', user.id)
            .eq('following_id', followingId);

        if (error) throw error;
    },

    // Check if following a user
    async isFollowing(followingId: string): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data, error } = await supabase
            .from('user_follows')
            .select('*')
            .eq('follower_id', user.id)
            .eq('following_id', followingId)
            .single();

        return !!data && !error;
    },

    // Get followers
    async getFollowers(userId: string) {
        const { data, error } = await supabase
            .from('user_follows')
            .select(`
        follower_id,
        profiles:follower_id (
          id,
          full_name,
          avatar_url
        )
      `)
            .eq('following_id', userId);

        if (error) throw error;
        return data;
    },

    // Get following
    async getFollowing(userId: string) {
        const { data, error } = await supabase
            .from('user_follows')
            .select(`
        following_id,
        profiles:following_id (
          id,
          full_name,
          avatar_url
        )
      `)
            .eq('follower_id', userId);

        if (error) throw error;
        return data;
    },

    // Get full user profile with stats
    async getUserProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    // =============================================
    // COMMUNITY POSTS (Q&A)
    // =============================================

    // Create a post
    async createPost(title: string, content: string, category: string, tags: string[] = []) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('community_posts')
            .insert({
                user_id: user.id,
                title,
                content,
                category,
                tags
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all posts with pagination
    async getPosts(category?: string, limit = 20, offset = 0): Promise<CommunityPost[]> {
        let query = supabase
            .from('community_posts')
            .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(post => ({
            ...post,
            user: post.profiles
        }));
    },

    // Get single post
    async getPost(id: string): Promise<CommunityPost> {
        const { data, error } = await supabase
            .from('community_posts')
            .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;

        // Increment view count
        await supabase
            .from('community_posts')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id);

        return {
            ...data,
            user: data.profiles
        };
    },

    // Update post
    async updatePost(id: string, updates: Partial<CommunityPost>) {
        const { error } = await supabase
            .from('community_posts')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },

    // Delete post
    async deletePost(id: string) {
        const { error } = await supabase
            .from('community_posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // =============================================
    // POST REPLIES
    // =============================================

    // Create reply
    async createReply(postId: string, content: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('community_replies')
            .insert({
                post_id: postId,
                user_id: user.id,
                content
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get replies for a post
    async getReplies(postId: string): Promise<CommunityReply[]> {
        const { data, error } = await supabase
            .from('community_replies')
            .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
            .eq('post_id', postId)
            .order('is_best_answer', { ascending: false })
            .order('upvotes', { ascending: false });

        if (error) throw error;

        return (data || []).map(reply => ({
            ...reply,
            user: reply.profiles
        }));
    },

    // Mark as best answer
    async markBestAnswer(replyId: string, postId: string) {
        // First, unmark any existing best answer
        await supabase
            .from('community_replies')
            .update({ is_best_answer: false })
            .eq('post_id', postId);

        // Mark the new best answer
        const { error } = await supabase
            .from('community_replies')
            .update({ is_best_answer: true })
            .eq('id', replyId);

        if (error) throw error;

        // Mark post as resolved
        await supabase
            .from('community_posts')
            .update({ is_resolved: true })
            .eq('id', postId);
    },

    // =============================================
    // VOTES
    // =============================================

    // Vote on post or reply
    async vote(itemType: 'post' | 'reply', itemId: string, voteType: 'upvote' | 'downvote') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if user already voted
        const { data: existingVote } = await supabase
            .from('community_votes')
            .select('*')
            .eq('user_id', user.id)
            .eq('item_type', itemType)
            .eq('item_id', itemId)
            .single();

        if (existingVote) {
            if (existingVote.vote_type === voteType) {
                // Remove vote if clicking same button
                await supabase
                    .from('community_votes')
                    .delete()
                    .eq('id', existingVote.id);

                // Update count
                const table = itemType === 'post' ? 'community_posts' : 'community_replies';
                const field = voteType === 'upvote' ? 'upvotes' : 'downvotes';
                await supabase.rpc('decrement', { row_id: itemId, table_name: table, field_name: field });
            } else {
                // Change vote
                await supabase
                    .from('community_votes')
                    .update({ vote_type: voteType })
                    .eq('id', existingVote.id);

                // Update counts
                const table = itemType === 'post' ? 'community_posts' : 'community_replies';
                const oldField = existingVote.vote_type === 'upvote' ? 'upvotes' : 'downvotes';
                const newField = voteType === 'upvote' ? 'upvotes' : 'downvotes';

                const { data: item } = await supabase.from(table).select('*').eq('id', itemId).single();
                if (item) {
                    await supabase
                        .from(table)
                        .update({
                            [oldField]: Math.max(0, (item[oldField] || 0) - 1),
                            [newField]: (item[newField] || 0) + 1
                        })
                        .eq('id', itemId);
                }
            }
        } else {
            // New vote
            await supabase
                .from('community_votes')
                .insert({
                    user_id: user.id,
                    item_type: itemType,
                    item_id: itemId,
                    vote_type: voteType
                });

            // Update count
            const table = itemType === 'post' ? 'community_posts' : 'community_replies';
            const field = voteType === 'upvote' ? 'upvotes' : 'downvotes';
            const { data: item } = await supabase.from(table).select('*').eq('id', itemId).single();
            if (item) {
                await supabase
                    .from(table)
                    .update({ [field]: (item[field] || 0) + 1 })
                    .eq('id', itemId);
            }
        }
    },

    // Get user's vote on an item
    async getUserVote(itemType: 'post' | 'reply', itemId: string): Promise<'upvote' | 'downvote' | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data } = await supabase
            .from('community_votes')
            .select('vote_type')
            .eq('user_id', user.id)
            .eq('item_type', itemType)
            .eq('item_id', itemId)
            .single();

        return data?.vote_type || null;
    },

    // =============================================
    // COMMUNITY PHOTOS
    // =============================================

    // Upload photo
    async uploadPhoto(file: File, caption: string, location: string, destinationId?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Upload image to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('community-photos')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('community-photos')
            .getPublicUrl(fileName);

        // Create photo record
        const { data, error } = await supabase
            .from('community_photos')
            .insert({
                user_id: user.id,
                image_url: publicUrl,
                caption,
                location,
                destination_id: destinationId
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get photos
    async getPhotos(limit = 20, offset = 0): Promise<CommunityPhoto[]> {
        const { data, error } = await supabase
            .from('community_photos')
            .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return (data || []).map(photo => ({
            ...photo,
            user: photo.profiles
        }));
    },

    // Delete photo
    async deletePhoto(id: string, imageUrl: string) {
        // Extract file path from URL
        const path = imageUrl.split('/community-photos/')[1];

        // Delete from storage
        if (path) {
            await supabase.storage
                .from('community-photos')
                .remove([path]);
        }

        // Delete record
        const { error } = await supabase
            .from('community_photos')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // =============================================
    // MEETUPS
    // =============================================

    // Create meetup
    async createMeetup(meetup: Omit<Meetup, 'id' | 'user_id' | 'current_travelers' | 'created_at' | 'status'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('meetups')
            .insert({
                user_id: user.id,
                ...meetup
            })
            .select()
            .single();

        if (error) throw error;

        // Auto-add creator as participant
        await supabase
            .from('meetup_participants')
            .insert({
                meetup_id: data.id,
                user_id: user.id,
                status: 'accepted'
            });

        return data;
    },

    // Get meetups
    async getMeetups(status?: string, limit = 20, offset = 0): Promise<Meetup[]> {
        let query = supabase
            .from('meetups')
            .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
            .order('start_date', { ascending: true })
            .range(offset, offset + limit - 1);

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(meetup => ({
            ...meetup,
            user: meetup.profiles
        }));
    },

    // Join meetup
    async joinMeetup(meetupId: string, message?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('meetup_participants')
            .insert({
                meetup_id: meetupId,
                user_id: user.id,
                message,
                status: 'pending'
            });

        if (error) throw error;
    },

    // Leave meetup
    async leaveMeetup(meetupId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('meetup_participants')
            .delete()
            .eq('meetup_id', meetupId)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    // =============================================
    // LIKES
    // =============================================

    // Like an item
    async likeItem(itemType: string, itemId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('community_likes')
            .insert({
                user_id: user.id,
                item_type: itemType,
                item_id: itemId
            });

        if (error && error.code !== '23505') throw error; // Ignore duplicate error

        // Update like count
        if (itemType === 'photo') {
            const { data: photo } = await supabase
                .from('community_photos')
                .select('likes')
                .eq('id', itemId)
                .single();

            if (photo) {
                await supabase
                    .from('community_photos')
                    .update({ likes: (photo.likes || 0) + 1 })
                    .eq('id', itemId);
            }
        }
    },

    // Unlike an item
    async unlikeItem(itemType: string, itemId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('community_likes')
            .delete()
            .eq('user_id', user.id)
            .eq('item_type', itemType)
            .eq('item_id', itemId);

        if (error) throw error;

        // Update like count
        if (itemType === 'photo') {
            const { data: photo } = await supabase
                .from('community_photos')
                .select('likes')
                .eq('id', itemId)
                .single();

            if (photo) {
                await supabase
                    .from('community_photos')
                    .update({ likes: Math.max(0, (photo.likes || 0) - 1) })
                    .eq('id', itemId);
            }
        }
    },

    // Check if user liked an item
    async hasLiked(itemType: string, itemId: string): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data } = await supabase
            .from('community_likes')
            .select('*')
            .eq('user_id', user.id)
            .eq('item_type', itemType)
            .eq('item_id', itemId)
            .single();

        return !!data;
    },

    // =============================================
    // COMMENTS
    // =============================================

    // Add comment
    async addComment(itemType: string, itemId: string, content: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('community_comments')
            .insert({
                user_id: user.id,
                item_type: itemType,
                item_id: itemId,
                content
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get comments
    async getComments(itemType: string, itemId: string): Promise<Comment[]> {
        const { data, error } = await supabase
            .from('community_comments')
            .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
            .eq('item_type', itemType)
            .eq('item_id', itemId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return (data || []).map(comment => ({
            ...comment,
            user: comment.profiles
        }));
    },

    // Delete comment
    async deleteComment(id: string) {
        const { error } = await supabase
            .from('community_comments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // =============================================
    // SAVED ITEMS
    // =============================================

    // Save an item
    async saveItem(itemType: string, itemId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('saved_items')
            .insert({
                user_id: user.id,
                item_type: itemType,
                item_id: itemId
            });

        if (error && error.code !== '23505') throw error;
    },

    // Unsave an item
    async unsaveItem(itemType: string, itemId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('saved_items')
            .delete()
            .eq('user_id', user.id)
            .eq('item_type', itemType)
            .eq('item_id', itemId);

        if (error) throw error;
    },

    // Check if item is saved
    async isSaved(itemType: string, itemId: string): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data } = await supabase
            .from('saved_items')
            .select('*')
            .eq('user_id', user.id)
            .eq('item_type', itemType)
            .eq('item_id', itemId)
            .single();

        return !!data;
    },

    // Get saved items
    async getSavedItems(itemType?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = supabase
            .from('saved_items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (itemType) {
            query = query.eq('item_type', itemType);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }
};
