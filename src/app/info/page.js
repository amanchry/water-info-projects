"use client";

import AppHeader from "@/components/common/AppHeader";
import LeftNav from "@/components/common/LeftNav";
import { Box, Flex, Text, Separator, Button } from "@radix-ui/themes";
import React from "react";
import { FileText, Play } from "lucide-react";

function WaterAccountingReport() {
  return (
    <>
      {/* 🔹 App Header */}
      <AppHeader />

      {/* 🔹 Page Layout */}
      <Flex
        height="100vh"
        pt="49px"
        align="stretch"
        justify="between"
        direction={{ sm: "row", initial: "column-reverse" }}
      >
        {/* ========== LEFT NAV ========== */}
        <Box>
          <LeftNav />
        </Box>

        {/* ========== MAIN CONTENT ========== */}
        <Box
          className="flex-1 overflow-y-auto p-8 bg-gray-50"
        >
          {/* Page Title */}
<Box mb="6">
            <Text
              as="h1"
              weight="medium"
              size="8"
              className="text-gray-900 mb-3"
            >
              Water Informatics Tools & Projects Hub
            </Text>

            <Text
              as="p"
              size="5"
              className="text-gray-600 leading-relaxed max-w-3xl"
            >
              The Water Informatics Tools & Projects Hubis an
              internal platform developed for the World Bank Water
              Informatics Team to showcase, organize, and access all
              ongoing and completed geospatial tools, dashboards, and
              applications developed under the team’s global initiatives.
            </Text>
          </Box>






        </Box>
      </Flex>
    </>
  );
}

export default WaterAccountingReport;
