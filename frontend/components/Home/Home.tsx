"use client";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { Loader, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet';
import Feed from './Feed';
import { redirect} from 'next/navigation';
import { RootState } from '@/store/store';
import { BASE_API_URL } from '@/server';
import axios from 'axios';
import { handleAuthRequest } from '../utils/apiRequest';
import { setAuthUser } from '@/store/authSlice';

const Home = () => {

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthUser = async () => {
      const getAuthUserReq = async () => await axios.get(`${BASE_API_URL}/users/me`, { withCredentials: true });
      const result = await handleAuthRequest(getAuthUserReq, setIsLoading);

      if (result) {
        dispatch(setAuthUser(result.data.data.user));
      }
    };
    getAuthUser();
  }, [dispatch]);

  useEffect(() => {
    if (!user) return redirect("/auth/login")
  }, [user]);
  
  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center flex-col'>
        <Loader className='animate-spin' />
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="w-[20%] hidden md:block border-r-2 h-screen fixed ">
        <LeftSidebar />
      </div>
      <div className="flex-1 md:ml-[20%] overerflow-y-auto">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <MenuIcon />
            </SheetTrigger>

            <SheetContent>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <LeftSidebar />
            </SheetContent>
          </Sheet>
        </div>
        <Feed />
      </div>
      <div className="w-[30%] pt-8 px-8 lg:block hidden ">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Home