import {
  Avatar,
  Box,
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import ProfileDropDown from "../ui/ProfileDropDown";
import {
  Cross1Icon,
  HamburgerMenuIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
// import UserProfile from "../UserProfile";

import { signOut, useSession } from "next-auth/react";
import { useGlobalStorage } from "@/provider/GlobalProvider";
import Link from "next/link";

// import Tour from "./Tourbkp";

function AppHeader() {
  const {
    setShowNav,
    showNav,
  } = useGlobalStorage();
  const [showProfile, setShowProfile] = useState(false);

  const [showTour, setShowTour] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userProfile, setUserProfile] = useState(null);


  const { data: session } = useSession();

  useEffect(() => {
    setIsMounted(true);
    // Only show intro if not already shown in this browser
    if (typeof window !== "undefined") {
      const introSeen = localStorage.getItem("showIntro");
      if (introSeen !== "false") {
        setShowIntro(true);
      }
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      // fetchUserProfile();
    }
  }, [session]);

  // const fetchUserProfile = async () => {
  //   try {
  //     const response = await fetch("/api/user/profile");
  //     if (response.ok) {
  //       const userData = await response.json();
  //       console.log("User Profile----------:", userData);
  //       setUserProfile(userData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user profile:", error);
  //   }
  // };

  // When user closes intro, set localStorage
  const handleCloseIntro = () => {
    setShowIntro(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("showIntro", "false");
    }
  };

  // When user finishes tour, set localStorage
  const handleTourExit = () => {
    setShowTour(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("showIntro", "false");
    }
  };

  return (
    <>


      <Flex direction="column" position="fixed" top="0" width="100%">
        <Flex
          py="1"
          px="5"
          justify="between"
          align="center"
          className="bg-[#FCFCFD]"
        >
          <Flex gap="3" align="center">

            <Image src="/images/Logo_WI.png" alt="Logo" width={70} height={30} />
            <Image
              src="/images/Logo_WB_Dark.png"
              alt="Logo"
              width={151}
              height={30}
              className="hidden md:block"
            />
          </Flex>
          <Flex gap="1">
            

            <Flex width="40px" height="40px" justify="center" align="center">
              <ProfileDropDown
                trigger={
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden cursor-pointer ${userProfile?.profileImage ? "" : "bg-primary1 text-white"
                      }`}
                  >
                    {userProfile?.profileImage ? (
                      <img
                        src={userProfile.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userProfile?.firstName?.[0] ||
                      session?.user?.name?.[0]?.toUpperCase() ||
                      "U"
                    )}
                  </div>
                }
              >
                <DropdownMenu.Item>
                  <div className="flex flex-col items-center justify-center w-full">
                    <div
                      className={`size-16 rounded-full mx-auto flex items-center justify-center relative overflow-hidden ${userProfile?.profileImage
                        ? ""
                        : "bg-primary1 text-white"
                        }`}
                    >
                      {userProfile?.profileImage ? (
                        <img
                          src={userProfile.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        userProfile?.firstName?.[0] ||
                        session?.user?.name?.[0]?.toUpperCase() ||
                        "U"
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-3 pb-1">
                      <h4 className="text-xl">
                        {userProfile?.firstName && userProfile?.lastName
                          ? `${userProfile.firstName} ${userProfile.lastName}`
                          : session?.user?.name || "User"}
                      </h4>
                      {/* <button
                        className="size-6 bg-[var(--gray-3)] text-[var(--gray-9)] rounded-full flex justify-center items-center"
                        onClick={() => setShowProfile(!showProfile)}
                      >
                        <Pencil1Icon />
                      </button> */}
                    </div>
                    {/* <h5 className="text-gray1 text-sm">
                      {userProfile?.profession || "User"}
                    </h5> */}
                    <hr className="border-[var(--gray-4)] w-full my-2" />
                    {/* <p className="px-3 text-gray2 text-xs">
                      {session?.user.email}
                    </p> */}
                    <button
                      className="text-sm text-primary3 mt-6 border border-primary3 px-3 py-1 rounded-sm"
                      onClick={() =>
                        signOut({
                          redirect: false, // don't let NextAuth handle it
                        }).then(() => {
                          window.location.href = `${process.env.NEXT_PUBLIC_URL}/auth/login`;
                        })
                      }



                    >
                      Sign out
                    </button>
                  </div>
                </DropdownMenu.Item>
              </ProfileDropDown>
              {/* <Avatar fallback="A" size="3" variant="solid" radius="full" /> */}
            </Flex>
          </Flex>
        </Flex>
        <Separator my="0" size="4" width="100%" />
      </Flex>

      {/* <UserProfile show={showProfile} setShow={setShowProfile} /> */}
    </>
  );
}

export default AppHeader;
