import React, { ReactElement } from "react";
import { Link as RouteLink } from "../data/types";
import Link from "next/link";

interface LinkViewerProps {
    link: RouteLink
}

export default function LinkViewer({link}:LinkViewerProps): ReactElement {
    return <li key={link.visibleText}>
        <Link href={link.route}>{link.visibleText}</Link>
    </li>
}