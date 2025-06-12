import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-feijo-gray group-[.toaster]:border-feijo-gray group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-feijo-gray",
          actionButton:
            "group-[.toast]:bg-feijo-gray group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-white group-[.toast]:text-feijo-gray",
          success: "group-[.toast]:bg-white group-[.toast]:text-feijo-gray group-[.toast]:border-feijo-gray",
          error: "group-[.toast]:bg-white group-[.toast]:text-feijo-red group-[.toast]:border-feijo-red",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
