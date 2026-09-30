import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

// Profile links, shared by the navbar and the footer so a handle is changed in
// one place. An entry with no `href` is not rendered anywhere, so a missing
// URL never ships as a broken or wrong link.
export const SOCIALS = {
  github: { label: "GitHub", icon: FaGithub, href: "https://github.com/rushikeshmahajann" },
  x: { label: "X", icon: FaXTwitter, href: "https://x.com/rushy_0" },
  linkedin: { label: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/in/rushikeshmahajann/" },
} as const;
