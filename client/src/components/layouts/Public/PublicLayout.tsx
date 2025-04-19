import { Box } from "@mui/material";
import Header from "./PublicHeader";
import Footer from "./PublicFooter";
export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box>
            <Header />
            {children}
            <Footer />
        </Box>
    )
}

export default PublicLayout;