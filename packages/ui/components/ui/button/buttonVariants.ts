import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default'
    },
    variants: {
      size: {
        default: 'h-9 px-4 py-2',
        icon: 'h-9 w-9',
        lg: 'h-10 rounded-md px-8',
        sm: 'h-8 rounded-md px-3 text-xs',
        xs: 'h-7 rounded px-2'
      },
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-error text-white shadow-sm hover:bg-error/90',
        ghost: 'hover:bg-surface-variant hover:text-on-surface-variant',
        link: 'text-primary underline-offset-4 hover:underline',
        outline:
          'border border-outline-variant bg-surface shadow-sm hover:bg-surface-variant hover:text-on-surface',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80'
      }
    }
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
