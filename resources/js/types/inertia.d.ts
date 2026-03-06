import { PageProps as InertiaPageProps } from '@inertiajs/core'

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
        }
    }
}

