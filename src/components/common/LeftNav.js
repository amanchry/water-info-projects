import { Box, Button, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGlobalStorage } from "@/provider/GlobalProvider";
import Link from "next/link";
import styles from "./LeftNav.module.css";

function LeftNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("overView");
  const {
    showNav,
    setShowNav,
    showDataManual,
    setShowDataManual,
    showDownloads,
    setShowDownloads,
  } = useGlobalStorage();

useEffect(() => {
  if (pathname === "/") {
    setActiveNav("overView");
  } else if (pathname.startsWith("/info")) {
    setActiveNav("info");
  }else {
    setActiveNav(""); // reset to none
  }
}, [pathname]);



  return (
    <>
      <Flex
        className="bg-[#FCFCFD]"
        direction="column"
        py="4"
        display={{ initial: "none", sm: "flex" }}
      >
        <Flex width="48px" height="48px" justify="center" align="center">
          <Tooltip content="Water Accounting Report Generator" side="right">
            <IconButton
              variant={activeNav === "overView" ? "soft" : "ghost"}
              size="4"
              radius="none"
              onClick={() => router.push("/")}
              id="overview"
              className={`${styles.navButton} ${activeNav === "overView" ? styles.active : ""}`}
              style={activeNav === "overView" ? { backgroundColor: "#EDF3F9" } : {}}
            >
              <Box
                as="span"
                className={`${
                  activeNav === "overView"
                    ? "icon-IconCrosshairSimple1"
                    : "icon-IconCrosshairSimple"
                } text-2xl ${styles.navIcon}`}
                style={activeNav === "overView" ? { color: "#3F7FC0" } : {}}
              ></Box>
            </IconButton>
          </Tooltip>
        </Flex>
        {/* <Flex width="48px" height="48px" justify="center" align="center">
          <Tooltip content="Water Balance & Usage" side="right">
            <IconButton
              variant={activeNav === "water" ? "soft" : "ghost"}
              size="4"
              radius="none"
              onClick={() =>
                router.push("/water")
              }
              id="water"
              className={`${styles.navButton} ${activeNav === "water" ? styles.active : ""}`}
              style={activeNav === "water" ? { backgroundColor: "#EDF3F9" } : {}}
            >
              <Box
                as="span"
                className={`${
                  activeNav === "water"
                    ? "icon-IconDropHalfBottom1"
                    : "icon-IconDropHalfBottom"
                } text-2xl ${styles.navIcon}`}
                style={activeNav === "water" ? { color: "#3F7FC0" } : {}}
              ></Box>
            </IconButton>
          </Tooltip>
        </Flex> */}


        

        <Flex width="48px" height="48px" justify="center" align="center">
          <Tooltip content="Info" side="right">
            <IconButton
              variant={activeNav === "info" ? "soft" : "ghost"}
              size="4"
              radius="none"
              onClick={() => router.push("/info")}
              id="info"
              className={`${styles.navButton} ${activeNav === "info" ? styles.active : ""}`}
              style={activeNav === "info" ? { backgroundColor: "#EDF3F9" } : {}}
            >
              <Box
                as="span"
                className={`${
                  activeNav === "info"
                    ? "icon-IconInfo"
                    : "icon-IconInfo"
                } text-2xl ${styles.navIcon}`}
                style={activeNav === "info" ? { color: "#3F7FC0" } : {}}
              ></Box>
            </IconButton>
          </Tooltip>
        </Flex>

        {/* <Flex width="48px" height="48px" justify="center" align="center">
          <Tooltip content="Water Accounting Report Generator" side="right">
            <IconButton
              variant={activeNav === "wagen" ? "soft" : "ghost"}
              size="4"
              radius="none"
              onClick={() => router.push("/wagen")}
              id="wagen"
              className={`${styles.navButton} ${activeNav === "wagen" ? styles.active : ""}`}
              style={activeNav === "wagen" ? { backgroundColor: "#EDF3F9" } : {}}
            >
              <Box
                as="span"
                className={`${
                  activeNav === "wagen"
                    ? "icon-Iconpdf1"
                    : "icon-Iconpdf"
                } text-2xl ${styles.navIcon}`}
                style={activeNav === "wagen" ? { color: "#3F7FC0" } : {}}
              ></Box>
            </IconButton>
          </Tooltip>
        </Flex> */}


      </Flex>

      

    </>
  );
}

export default LeftNav;
