import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BananaIcon } from "@/components/banana-icon"

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border bg-card">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <BananaIcon size={48} />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            Payment Successful!
          </CardTitle>
          <p className="text-muted-foreground">
            Thank you for subscribing to Nano Banana
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/50 rounded-lg p-6 text-center">
            <p className="text-foreground mb-2">Your subscription is now active</p>
            <p className="text-sm text-muted-foreground">
              You can start using all the premium features right away
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/#editor" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-accent">
                Start Creating
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Need help? <Link href="mailto:support@nanobanana.ai" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
