import { supabase } from './supabaseClient';
import { UserDocument } from '../types';

export const documentService = {
    // Get all documents for the current user
    async getUserDocuments(userId: string): Promise<UserDocument[]> {
        const { data, error } = await supabase
            .from('user_documents')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Upload a new document
    async uploadUserDocument(
        userId: string,
        file: File,
        name: string,
        type: 'adhar' | 'passport' | 'license' | 'other'
    ): Promise<UserDocument> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${type}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`; // Folder based structure

        console.log(`[Service] Uploading file to path: ${filePath}`);

        // 1. Upload to Storage (Private Bucket)
        const { data: storageData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('[Service] Storage upload error:', uploadError);
            throw uploadError;
        }

        console.log('[Service] Storage upload success:', storageData);

        // 2. Save Metadata to Database
        const { data, error: dbError } = await supabase
            .from('user_documents')
            .insert({
                user_id: userId,
                name,
                type,
                file_path: filePath
            })
            .select()
            .single();

        if (dbError) {
            console.error('[Service] DB insert error:', dbError);
            // Rollback storage upload if DB fails (optional but good practice)
            await supabase.storage.from('documents').remove([filePath]);
            throw dbError;
        }

        return data;
    },

    // Get a signed URL for viewing
    async getDocumentUrl(filePath: string): Promise<string> {
        const { data, error } = await supabase.storage
            .from('documents')
            .createSignedUrl(filePath, 3600); // 1 hour validity

        if (error) throw error;
        return data.signedUrl;
    },

    // Delete a document
    async deleteUserDocument(documentId: string, filePath: string): Promise<void> {
        console.log(`[Service] Deleting document: ${documentId}, path: ${filePath}`);

        // 1. Delete from Storage (Best effort)
        try {
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove([filePath]);

            if (storageError) {
                console.warn('[Service] Storage delete warning (continuing):', storageError);
            } else {
                console.log('[Service] Storage delete success');
            }
        } catch (e) {
            console.warn('[Service] Storage delete exception (continuing):', e);
        }

        // 2. Delete from Database
        const { error: dbError } = await supabase
            .from('user_documents')
            .delete()
            .eq('id', documentId);

        if (dbError) {
            console.error('[Service] DB delete error:', dbError);
            throw dbError;
        }
        console.log('[Service] DB delete success');
    }
};
