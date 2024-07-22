import React from "react";
import Section from "../Section";
import { Container, Typography, Grid, Link } from "@mui/material";

import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <Section id="footer" height="30vh" bgImage="/footer.jpg">
      <Container
        maxWidth="m"
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "column",
          pt: 8,
        }}
      >
        <Grid
          container
          spacing={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pl={4}
          pr={0}
        >
          <Grid item xs={12} sm={6} md={2}>
            <div className="logo">
              <img src="/logo.png" alt="Logo" />
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  color: "#fff",
                  fontWeight: "800",
                  fontFamily: "Popins, sans-serif",
                }}
              >
                SQLCinema
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={3} display="flex" gap={2}>
            <Link
              href="https://www.facebook.com/"
              underline="none"
              sx={{
                borderRadius: "50%",
              }}
            >
              <FacebookRoundedIcon
                sx={{
                  fontSize: 40,
                  color: "#fff",
                  ["&:hover"]: { color: "#4267B2" },
                }}
              />
            </Link>
            <Link
              href="https://www.twitter.com/"
              underline="none"
              sx={{
                borderRadius: "50%",
              }}
            >
              <TwitterIcon
                sx={{
                  fontSize: 40,
                  color: "#fff",
                  ["&:hover"]: { color: "#1DA1F2" },
                }}
              />
            </Link>
            <Link
              href="https://www.instagram.com/"
              underline="none"
              sx={{
                borderRadius: "50%",
              }}
            >
              <InstagramIcon
                sx={{
                  fontSize: 40,
                  color: "#fff",
                  ["&:hover"]: {
                    color: "#E1306C",
                  },
                }}
              />
            </Link>
            <Link
              href="https://www.linkedin.com/"
              underline="none"
              sx={{
                borderRadius: "50%",
              }}
            >
              <LinkedInIcon
                sx={{
                  fontSize: 40,
                  color: "#fff",
                  ["&:hover"]: {
                    color: "#0A66C2",
                  },
                }}
              />
            </Link>
          </Grid>
        </Grid>
        <Grid>
          <div>
            &copy; {new Date().getFullYear()} SQLCinema. All rights reserved.
          </div>
        </Grid>
      </Container>
    </Section>
  );
};

export default Footer;
