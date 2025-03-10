
import React, { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Key, Bell, Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function ProfilePage() {
  const { user, getUserName, getUserAvatar, getUserEmailNotifications, getLastSignIn, updateUserProfile } = useAuth();
  const { t } = useTranslation(['auth', 'general']);
  const navigate = useNavigate();
  
  const [name, setName] = useState(getUserName());
  const [email, setEmail] = useState(user?.email || "");
  const [emailNotifications, setEmailNotifications] = useState(getUserEmailNotifications());
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(getUserAvatar());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const success = await updateUserProfile({
      name,
      email_notifications: emailNotifications,
      // Avatar is updated separately
    });
    
    setIsUpdating(false);
    
    if (success) {
      // Nothing else needed here as the toast is shown by the updateUserProfile function
    }
  };
  
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For this implementation, we'll use a data URL for preview
    // In a real app, you would upload to storage and get a URL
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);
      
      // Update the avatar in user metadata
      await updateUserProfile({
        avatarUrl: base64String
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveAvatar = async () => {
    setAvatarPreview(undefined);
    await updateUserProfile({
      avatarUrl: ""
    });
  };
  
  // Format the last sign in date
  const lastSignIn = getLastSignIn();
  const formattedLastSignIn = lastSignIn 
    ? format(new Date(lastSignIn), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })
    : null;

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {t('general:profileSettings', 'Profil & Einstellungen')}
          </h1>
          <p className="text-tender-600">
            {t('general:manageProfileSettings', 'Verwalten Sie Ihre persönlichen Informationen und Kontoeinstellungen')}
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              {t('general:profile', 'Profil')}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Key size={16} />
              {t('general:security', 'Sicherheit')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              {t('general:notifications', 'Benachrichtigungen')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('general:profilePicture', 'Profilbild')}
                    </CardTitle>
                    <CardDescription>
                      {t('general:profilePictureDescription', 'Dieses Bild wird in Ihrem Profil angezeigt')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="relative cursor-pointer" onClick={handleAvatarClick}>
                      <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage src={avatarPreview} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {getUserName().substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-4 right-0 bg-primary rounded-full p-2 shadow-md">
                        <Upload size={16} className="text-white" />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    {avatarPreview && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive"
                        onClick={handleRemoveAvatar}
                      >
                        <Trash2 size={16} className="mr-2" />
                        {t('general:removeImage', 'Bild entfernen')}
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('general:accountInfo', 'Kontoinformationen')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-tender-500">
                        {t('general:userId', 'Benutzer-ID')}
                      </p>
                      <p className="text-sm font-mono truncate">{user?.id}</p>
                    </div>
                    {formattedLastSignIn && (
                      <div>
                        <p className="text-sm font-medium text-tender-500">
                          {t('general:lastLogin', 'Letzte Anmeldung')}
                        </p>
                        <p className="text-sm">{formattedLastSignIn}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t('general:personalInformation', 'Persönliche Informationen')}
                    </CardTitle>
                    <CardDescription>
                      {t('general:updateProfileInfo', 'Aktualisieren Sie Ihre persönlichen Informationen')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">
                              {t('auth:name', 'Name')}
                            </Label>
                            <Input 
                              id="name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                              placeholder={t('auth:name', 'Name')}
                              disabled={isUpdating}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">
                              {t('auth:email', 'E-Mail')}
                            </Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={email} 
                              disabled
                              readOnly
                              className="bg-tender-50"
                            />
                            <p className="text-xs text-tender-500">
                              {t('general:emailChangeContact', 'Für eine Änderung der E-Mail-Adresse kontaktieren Sie bitte den Support')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating
                            ? t('general:saving', 'Wird gespeichert...')
                            : t('general:saveChanges', 'Änderungen speichern')}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid gap-6 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('general:passwordSecurity', 'Passwort & Sicherheit')}
                  </CardTitle>
                  <CardDescription>
                    {t('general:managePasswordSecurity', 'Verwalten Sie Ihr Passwort und Ihre Sicherheitseinstellungen')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-md bg-tender-50">
                    <div>
                      <h3 className="font-medium">{t('auth:password', 'Passwort')}</h3>
                      <p className="text-sm text-tender-600">
                        {t('general:lastPasswordChange', 'Passwort wurde zuletzt geändert am:')} 
                        {formattedLastSignIn ? format(new Date(lastSignIn!), "dd.MM.yyyy", { locale: de }) : t('general:unknown', 'Unbekannt')}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/update-password")}
                    >
                      {t('auth:updatePassword', 'Passwort aktualisieren')}
                    </Button>
                  </div>
                  
                  {/* Future: add two-factor authentication */}
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">{t('general:twoFactorAuth', 'Zwei-Faktor-Authentifizierung')}</h3>
                      <p className="text-sm text-tender-600">
                        {t('general:twoFactorAuthDescription', 'Erhöhen Sie die Sicherheit Ihres Kontos mit 2FA')}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      disabled
                    >
                      {t('general:comingSoon', 'Demnächst verfügbar')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="grid gap-6 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('general:notificationPreferences', 'Benachrichtigungseinstellungen')}
                  </CardTitle>
                  <CardDescription>
                    {t('general:manageNotifications', 'Verwalten Sie, wie und wann Sie Benachrichtigungen erhalten möchten')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{t('general:emailNotifications', 'E-Mail-Benachrichtigungen')}</h3>
                          <p className="text-sm text-tender-600">
                            {t('general:emailNotificationsDescription', 'Erhalten Sie wichtige Updates per E-Mail')}
                          </p>
                        </div>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications}
                          id="email-notifications"
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating
                            ? t('general:saving', 'Wird gespeichert...')
                            : t('general:saveChanges', 'Änderungen speichern')}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
