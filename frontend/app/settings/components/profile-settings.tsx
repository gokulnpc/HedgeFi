"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Wallet, Check, AlertTriangle } from "lucide-react"

export function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="grid gap-6">
      {/* Basic Info */}
      <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your account details and wallet connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input placeholder="Enter your name" defaultValue="Crypto Ninja" />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input placeholder="Choose a username" defaultValue="@cryptoninja" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Enter your email" defaultValue="crypto@ninja.com" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Connections */}
      <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Connected Wallets</CardTitle>
          <CardDescription>Manage your Web3 wallet connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* MetaMask */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-green-500/20">
              <div className="flex items-center gap-4">
                <Wallet className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">MetaMask</p>
                  <p className="text-sm text-muted-foreground">0x1234...5678</p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <Check className="mr-1 h-3 w-3" />
                  Primary
                </Badge>
              </div>
              <Button variant="outline">Disconnect</Button>
            </div>

            {/* Phantom */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/10">
              <div className="flex items-center gap-4">
                <Wallet className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Phantom</p>
                  <p className="text-sm text-muted-foreground">7vfCX...voxs</p>
                </div>
              </div>
              <Button variant="outline">Disconnect</Button>
            </div>

            {/* Add New Wallet */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-dashed border-white/20">
              <div className="flex items-center gap-4">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Connect New Wallet</p>
                  <p className="text-sm text-muted-foreground">Add another wallet to your account</p>
                </div>
              </div>
              <Button>Connect</Button>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-yellow-500">
              For enhanced security, enable 2FA in the Security tab when connecting multiple wallets.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

