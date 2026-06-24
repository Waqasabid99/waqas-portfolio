import { getUserProjects } from "@/actions/project.action";
import AdminDashboard from "@/pages/adminDashboard/AdminDashboard";
import ClientDashboard from "@/pages/userDashboard/ClientDashborad";

export const generateMetadata = async ({ params }) => {
    const { role } = await params;
    const CapitalizeRole = role.charAt(0).toUpperCase() + role.slice(1);
    return {
        title: `${CapitalizeRole} Dashboard`,
        description: `Welcome to ${CapitalizeRole} Dashboard - Manage your profile, projects, and more`,
    }
}

const page = async ({ params }) => {
    const { role } = await params;
    return (
        <main>
            {role === "user" && <ClientDashboard />}
            {role === "admin" && <AdminDashboard />}
        </main>
    )
}

export default page