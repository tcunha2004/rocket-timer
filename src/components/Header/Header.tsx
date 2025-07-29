import { HeaderContainer } from "./styles";
import { BiRocket } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa6";
import { FaRegNewspaper } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <HeaderContainer>
      <BiRocket size={45} />
      <nav>
        <NavLink to="/" title="Timer">
          <FaRegClock size={30} />
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <FaRegNewspaper size={30} />
        </NavLink>
      </nav>
    </HeaderContainer>
  );
}

export default Header;
