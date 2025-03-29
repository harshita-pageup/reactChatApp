import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'
import { Camera, Loader2, LockIcon, SkipBack, User2, UserX2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import axiosInstance from '@/api/axiosInstance';
import { removeToken } from '@/utils/auth';
import * as Yup from "yup";
import AlertMsg from '@/components/alert-msg';
import { useFormik } from 'formik';
import { ChangePasswordRequest } from '@/types/auth';
import ValidationMsg from '@/components/validation-err';
import { useUser } from '@/context/UserContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { BASE_URL } from '@/api/enviornment';

const Profile = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<number>(1);

  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <h1 className="text-xl font-bold p-1">Profile</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => { setType(1); }} className={`border py-6 ${type === 1 ? 'bg-accent' : ''}`}>
                    <a className='flex items-center gap-2'>
                      <User2 />
                      Profile
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => { setType(2); }} className={`border py-6 ${type === 2 ? 'bg-accent' : ''}`}>
                    <a className='flex items-center gap-2'>
                      <LockIcon />
                      Change Password
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => { setType(3); }} className={`border py-6 ${type === 3 ? 'bg-accent' : ''}`}>
                    <a className='flex items-center gap-2'>
                      <UserX2 />
                      Delete Account
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenuButton onClick={() => { navigate('/chats'); }} className='border py-6'>
              <Link to="/chats" className='flex items-center gap-2'>
                <SkipBack />
                Go Back
              </Link>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>

        {type === 1 && <ProfileComponent />}
        {type === 2 && <ChangePasswordComponent />}
        {type === 3 && <DeleteAccountComponent />}
      </SidebarProvider>
      <Toaster />
    </>
  )
}

const profileValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(150, 'Name must be less than 150 characters')
    .required('Name is required'),
  email: Yup.string().max(150).email('Invalid email format').required('Email is required'),
  profileImage: Yup.string().nullable(),
});

function ProfileComponent() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>('https://ui-avatars.com/api/?background=222&color=fff&name=GU');
  const [nameState, setNameState] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<any>();
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { user, setUser } = useUser();

  useEffect(() => {
    setIsLoading(true)
    if (user) {
      if (user.profile) {
        setProfileImage(`${BASE_URL}/uploads/${user?.profile}`);
      }
      else {
        setProfileImage(`https://ui-avatars.com/api/?background=222&color=fff&name=${user.name}`);
      }
      setNameState(user.name);
      setEmail(user.email);
      setIsLoading(false)
    }
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // aspect ratio 1:1 for square crop
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const getCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      const croppedImageUrl = canvas.toDataURL('image/jpeg');
      setProfileImage(croppedImageUrl);
      setImageToCrop(null);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: nameState,
      email: email,
      profileImage: profileImage,
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      const updatedProfile = {
        name: values.name,
        email: values.email,
        profile: values.profileImage,
      };

      try {
        await axiosInstance.post(`/api/updateProfile`, updatedProfile).then(res => {
          if (res.status) {
            toast('Profile updated successfully.');
            setUser({
              ...res.data.data,
              profile: res.data.data.profile
            });
          } else {
            toast('Something went wrong! Please try again later.')
            console.error('Error updating profile');
          }
        });
      } catch (error) {
        toast('Something went wrong! Please try again later.')
        console.error('Error updating profile:', error);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-full gap-2">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className='text-primary animate-pulse'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='pl-10 pt-20'>
      <div className='flex flex-col gap-4 min-w-lg'>
        <h1 className='text-4xl font-bold mb-5'>Profile</h1>
        <div className='relative w-max'>
          <img src={profileImage} className='w-42 h-42 rounded-full object-cover' />
          <Button
            size="icon"
            className='absolute -bottom-0 -right-0 rounded-full'
            onClick={handleImageClick}
          >
            <Camera />
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <Dialog open={imageToCrop != null} onOpenChange={() => setImageToCrop(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crop Image</DialogTitle>
            </DialogHeader>
            <div className='max-w-[30rem] max-h-[30rem] text-center overflow-auto rounded-md'>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                {imageToCrop && (
                  <img
                    ref={imgRef}
                    src={imageToCrop}
                    onLoad={onImageLoad}
                    className="object-cover object-center"
                  />
                )}
              </ReactCrop>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <Button variant='outline' onClick={() => setImageToCrop(null)}>Cancel</Button>
              <Button onClick={getCroppedImage}>Crop & Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="name">Name</label>
            <Input id='name' placeholder='Name' className='w-full' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.errors.name && formik.touched.name && (
              <ValidationMsg msg={formik.errors.name} />
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="email">Email</label>
            <Input id='email' placeholder='Email' className='w-full' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.errors.email && formik.touched.email && (
              <ValidationMsg msg={formik.errors.email} />
            )}
          </div>
          <Button type='submit' className='w-min mt-2'>Submit</Button>
        </form>
      </div>
    </div>
  )
}

function ChangePasswordComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .min(6, 'Current password must be at least 6 characters')
      .matches(/[a-z]/, 'Current password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Current password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Current password must contain at least one number')
      .matches(/[@$!%*?&]/, 'Current password must contain at least one special character')
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(6, 'New password must be at least 6 characters')
      .matches(/[a-z]/, 'New password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'New password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'New password must contain at least one number')
      .matches(/[@$!%*?&]/, 'New password must contain at least one special character')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik<ChangePasswordRequest>({
    initialValues: { currentPassword: "", confirmPassword: "", newPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await axiosInstance.put(`/api/changePassword`, values);
        if (response.data.status) {
          setError("Password change successfully");
          setSuccessMsg(true);
        } else {
          setError(response.data.msg);
          setSuccessMsg(false);
        }
      } catch (error: any) {
        setError(error?.message || "An unknown error occurred.");
        setSuccessMsg(false);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className='pl-10 pt-20'>
      <div className='flex flex-col gap-4 min-w-lg'>
        {error && (
          <AlertMsg msg={error} isSuccess={successMsg} />
        )}
        <h1 className='text-4xl font-bold mb-5'>Change Password</h1>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="currentPassword">Current Password</label>
            <Input id='currentPassword' type='password' placeholder='Current Password' className='w-full' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.currentPassword} />
            {formik.errors.currentPassword && formik.touched.currentPassword && (
              <ValidationMsg msg={formik.errors.currentPassword} />
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="newPassword">New Password</label>
            <Input id='newPassword' type='password' placeholder='New Password' className='w-full' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.newPassword} />
            {formik.errors.newPassword && formik.touched.newPassword && (
              <ValidationMsg msg={formik.errors.newPassword} />
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Input id='confirmPassword' type='password' placeholder='Confirm Password' className='w-full' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword} />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <ValidationMsg msg={formik.errors.confirmPassword} />
            )}
          </div>
          <Button type="submit" className='w-min mt-2' disabled={loading}>
            {loading && (<Loader2 className="animate-spin" />)}
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

function DeleteAccountComponent() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const handleDeleteAccount = async () => {
    try {
      const response = await axiosInstance.delete('/api/deleteAccount');
      if (response.data.status) {
        removeToken();
        navigate('/');
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account");
    }
  };

  return (
    <div className='pl-10 pt-20'>
      <div className='flex flex-col gap-4 max-w-xl'>
        <h1 className='text-4xl font-bold mb-5'>Delete Account</h1>
        <p>Once your account is deleted, all of its resources and data will be permanently deleted.
          Before deleting your account, please download any data or information that you wish to
          retain.</p>

        <Dialog open={showConfirm} onOpenChange={() => setShowConfirm(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to permanently
                delete your account from our servers?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button variant='destructive' onClick={handleDeleteAccount}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant='destructive' className='w-min mt-2' onClick={() => setShowConfirm(true)}>Delete Account</Button>
      </div>
    </div>
  )
}

export default Profile