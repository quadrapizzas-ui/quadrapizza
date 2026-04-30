export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category_id: string | null
          image_url: string | null
          is_active: boolean
          is_menu_del_dia: boolean
          stock: number | null
          created_at: string
          updated_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          sort_order: number
          created_at: string
        }
      }
      product_modifiers: {
        Row: {
          id: string
          product_id: string
          name: string
          max_selections: number
          min_selections: number
          is_required: boolean
        }
      }
      modifier_options: {
        Row: {
          id: string
          modifier_id: string
          name: string
          extra_price: number
          is_available: boolean
        }
      }
    }
  }
}
