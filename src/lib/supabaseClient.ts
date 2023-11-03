import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Row<T extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][T]['Row'];
interface Database {
	public: {
		Tables: {
			results: {
				Row: {
					created_at: string;
					id: number;
					level: Row<'levels'> | null;
					score: number | null;
					time: number | null;
					user: string | null;
					username: string | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					level?: number | null;
					score?: number | null;
					time?: number | null;
					user?: string | null;
					username?: string | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					level?: number | null;
					score?: number | null;
					time?: number | null;
					user?: string | null;
					username?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'results_level_fkey';
						columns: ['level'];
						isOneToOne: false;
						referencedRelation: 'levels';
						referencedColumns: ['lvl#'];
					},
					{
						foreignKeyName: 'results_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			levels: {
				Row: {
					adminControls: boolean;
					cards: number | null;
					color: { from: string; to: string };
					created_at: string;
					id: number;
					level: string | null;
					'lvl#': number | null;
					time: number | null;
				};
				Insert: {
					adminControls?: boolean;
					cards?: number | null;
					'lvl#': number | null;
					color?: { from: string; to: string };
					created_at?: string;
					id?: number;
					level?: string | null;
					time?: number | null;
				};
				Update: {
					adminControls?: boolean;
					'lvl#': number | null;
					cards?: number | null;
					color?: { from: string; to: string };
					created_at?: string;
					id?: number;
					level?: string | null;
					time?: number | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;

const supabaseClient = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);
export default supabaseClient;
