import { redirect } from "next/navigation";


const DashboardPage = () => {
    redirect("/Dashboard/admin/Manage-Projects");
    return null;
};

export default DashboardPage;
