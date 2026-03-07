import { ProductSchemaType } from '@/shemas/productSchema'
import { PageProps as InertiaPageProps } from '@inertiajs/core'


interface Media {
  id: string;
  url: string;
  collection: string;
}

interface Draft {
  id:number;
  name: string;
  brand?: string;
  nichCategory?: { id: number; name: string } | null;
  thumbnail?: Media | null;
  updated_at: string;
  quality_score: number;
  ready_to_publish: boolean;
  variants?: Variant[];
  description?: string;
  tags?: string[];
  covers?: Media[];
}

type  ProductDetailType = ProductSchemaType & {
     nich_category : string , 
}
declare module '@inertiajs/core' {
 interface PageProps extends InertiaPageProps {
        flash: {
            success: string | null
            error:   string | null
        }
        auth: {
            user: {
                id:    number
                name:  string
                email: string
            }
        },
        product : ProductDetailType
        drafts : Draft[] , 
    }
}

