import SignupModal from "@/pages/auth/Register"

export const generateMetadata = async () => {
    return {
        title: "Sign Up - WaqasAbid",
        description: "Join WaqasAbid now - Create your account to access exclusive features and content!",
        keywords: ["Sign Up", "Register", "WaqasAbid", "Create Account", "Exclusive Features", "Content"],
    }
}
const page = () => {
    return (
        <SignupModal />
    )
}

export default page