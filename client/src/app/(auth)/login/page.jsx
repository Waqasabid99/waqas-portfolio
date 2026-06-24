import LoginModal from '@/pages/auth/Login'

export const generateMetadata = async () => {
    return {
        title: "Sign In - WaqasAbid",
        description: "Log in to your WaqasAbid account to access exclusive features and content!",
        keywords: ["Sign In", "Login", "WaqasAbid", "Login Account", "Exclusive Features", "Content"],
    }
};

const page = () => {
    return <LoginModal />
}

export default page
