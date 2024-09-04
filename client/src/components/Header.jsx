{/* Header component of the frontend */}

import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/logo1.png";
import Logo2 from "../images/logo2.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { LuPalette } from "react-icons/lu";
import { UserContext } from "../context/userContext";

const Header = () => {
  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavActive(false);
    } else {
      setIsNavActive(true);
    }
  };
  const [isNavActive, setIsNavActive] = useState(
    window.innerWidth > 800 ? true : false
  );
  const { currentUser } = useContext(UserContext);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [activeBg, setActiveBg] = useState("bg-1");

  useEffect(() => {
    // Retrieve theme from local storage if available
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setActiveBg(storedTheme);
      applyTheme(storedTheme);
    }
  }, []);

  const openThemeModal = () => {
    setThemeModalOpen(true);
  };

  const closeThemeModal = (e) => {
    if (e.target.classList.contains("customize-theme")) {
      setThemeModalOpen(false);
    }
  };

  let lightColorLightness;
  let whiteColorLightness;
  let darkColorLightness;

  const changeBG = () => {
    document.documentElement.style.setProperty(
      "--light-color-lightness",
      lightColorLightness
    );
    document.documentElement.style.setProperty(
      "--white-color-lightness",
      whiteColorLightness
    );
    document.documentElement.style.setProperty(
      "--dark-color-lightness",
      darkColorLightness
    );
  };

  const applyTheme = (theme) => {
    switch (theme) {
      case "bg-1":
        lightColorLightness = "92%";
        whiteColorLightness = "100%";
        darkColorLightness = "17%";
        break;
      case "bg-2":
        darkColorLightness = "95%";
        whiteColorLightness = "20%";
        lightColorLightness = "15%";
        break;
      case "bg-3":
        darkColorLightness = "95%";
        whiteColorLightness = "10%";
        lightColorLightness = "0%";
        break;
      default:
        break;
    }
    changeBG();
  };

  const handleBg1 = () => {
    setActiveBg("bg-1");
    localStorage.setItem("theme", "bg-1");
    applyTheme("bg-1");
  };

  const handleBg2 = () => {
    setActiveBg("bg-2");
    localStorage.setItem("theme", "bg-2");
    applyTheme("bg-2");
  };

  const handleBg3 = () => {
    setActiveBg("bg-3");
    localStorage.setItem("theme", "bg-3");
    applyTheme("bg-3");
  };

  const getLogo = () => {
    switch (activeBg) {
      case "bg-1":
        return Logo;
      case "bg-2":
        return Logo2;
      case "bg-3":
        return Logo2;
      default:
        return Logo;
    }
  };

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNavHandler}>
          <img src={getLogo()} alt="Navbar Logo" />
        </Link>
        {currentUser?._id && isNavActive && (
          <ul className="nav__menu">
            <li>
              <Link
                to={`/profile/${currentUser._id}`}
                onClick={closeNavHandler}
              >
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandler}>
                New Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandler}>
                Logout
              </Link>
            </li>
            <li>
              <Link to="#" id="theme-button" onClick={openThemeModal}>
                <LuPalette />
              </Link>
            </li>
          </ul>
        )}
        {!currentUser?._id && isNavActive && (
          <ul className="nav__menu">
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandler}>
                Login
              </Link>
            </li>
          </ul>
        )}
        <button
          className="nav__toggle-btn"
          onClick={() => setIsNavActive(!isNavActive)}
        >
          {isNavActive ? <AiOutlineClose /> : <FaBars />}
        </button>

        {/*--=============== Theme Customization ===============*/}

        {themeModalOpen && (
          <div className="customize-theme" onClick={closeThemeModal}>
            <div className="card" onClick={(e) => e.stopPropagation()}>
              <div className="background">
                <h3>
                  Background Change <br></br>
                  <br></br>
                </h3>
                <div className="choose-bg">
                  <div
                    className={`bg-1 ${activeBg === "bg-1" ? "active" : ""}`}
                    onClick={handleBg1}
                  >
                    <h5>Light</h5>
                  </div>
                  <div
                    className={`bg-2 ${activeBg === "bg-2" ? "active" : ""}`}
                    onClick={handleBg2}
                  >
                    <h5>Dim</h5>
                  </div>
                  <div
                    className={`bg-3 ${activeBg === "bg-3" ? "active" : ""}`}
                    onClick={handleBg3}
                  >
                    <h5>Dark</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
