"use client";

import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const Sidebar = () => {
    const { user, role, logout, isLoading } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mobileOpen, setMobileOpen] = useState(false);
    const sidebarRef = useRef(null);

    const userRole = role?.toLowerCase()?.trim() || "user";
    const isAdmin = userRole === "admin";

    // ─── Navigation Items ───────────────────────────────────────────────
    const navItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            href: `/${userRole}/dashboard`,
            icon: LayoutDashboard,
            roles: ["admin", "user"],
        },
        {
            id: "blog",
            label: "Blog",
            href: `/${userRole}/dashboard/blog`,
            icon: FileText,
            roles: ["admin"],
        },
        {
            id: "settings",
            label: "Settings",
            href: `/${userRole}/dashboard?tab=settings`,
            icon: Settings,
            roles: ["admin", "user"],
        },
    ];

    const visibleItems = navItems.filter((item) =>
        item.roles.includes(userRole)
    );

    // ─── Close mobile drawer on route change ────────────────────────────
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // ─── Close mobile drawer on outside click ───────────────────────────
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                mobileOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target)
            ) {
                setMobileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileOpen]);

    // ─── Prevent body scroll when mobile drawer is open ─────────────────
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    // ─── Check active link ──────────────────────────────────────────────
    const isActive = (href) => {
        if (href.includes("?")) {
            const search = searchParams.toString();
            const fullPath = search ? `${pathname}?${search}` : pathname;
            return fullPath === href;
        }
        return pathname === href;
    };

    // ─── Logout handler ─────────────────────────────────────────────────
    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    // ─── Sidebar Content (shared between desktop & mobile) ──────────────
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* ── Brand / User Section ── */}
            <div className="px-5 py-6 border-b border-gray-200">
                <Link href="/" className="flex items-center gap-2 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-[#1365ff] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">WA</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">WaqasAbid</span>
                </Link>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#1365ff] to-[#0b4fd4] flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {user?.full_name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                    </div>
                </div>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                    Menu
                </p>
                {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active
                                ? "bg-[#1365ff] text-white shadow-md shadow-blue-200"
                                : "text-gray-600 hover:bg-blue-50 hover:text-[#1365ff]"
                                }`}
                        >
                            <Icon
                                size={18}
                                className={`shrink-0 transition-colors duration-200 ${active
                                    ? "text-white"
                                    : "text-gray-400 group-hover:text-[#1365ff]"
                                    }`}
                            />
                            <span className="flex-1">{item.label}</span>
                            {active && (
                                <ChevronRight size={14} className="text-white/70" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Logout ── */}
            <div className="px-3 py-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                    <LogOut size={18} className="shrink-0" />
                    <span>{isLoading ? "Logging out…" : "Logout"}</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* ── Mobile Hamburger Button ── */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-1001 p-2 rounded-lg bg-white shadow-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Open Sidebar"
            >
                <Menu size={20} />
            </button>

            {/* ── Mobile Backdrop ── */}
            <div
                className={`lg:hidden fixed inset-0 z-1002 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setMobileOpen(false)}
            />

            {/* ── Mobile Sidebar Drawer ── */}
            <aside
                ref={sidebarRef}
                className={`lg:hidden fixed top-0 left-0 z-1003 w-[270px] h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Close button */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                    aria-label="Close Sidebar"
                >
                    <X size={18} />
                </button>
                <SidebarContent />
            </aside>

            {/* ── Desktop Sidebar (fixed) ── */}
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[250px] bg-white border-r border-gray-200 z-40">
                <SidebarContent />
            </aside>
        </>
    );
};

export default Sidebar;
