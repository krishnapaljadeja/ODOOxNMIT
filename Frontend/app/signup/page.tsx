import { AuthLayout } from "@/components/auth/auth-layout"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <AuthLayout title="Join EcoFinds" subtitle="Create your account to start shopping sustainably">
      <SignupForm />
    </AuthLayout>
  )
}
