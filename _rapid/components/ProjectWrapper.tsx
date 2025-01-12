"use client"

import React, { ReactNode } from "react";
import { RapidContextProvider } from "../context/store";

interface ProjectWrapperProps {
    children: ReactNode
}

export default function ProjectWrapper({children}: ProjectWrapperProps) {
    return <RapidContextProvider>
        {children}
    </RapidContextProvider>
};