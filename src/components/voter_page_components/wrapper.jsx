import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import CircleCard from "./circle_card";
import FLinkCard from "./f_link_card";
import VoterCard from "./voter_card";

const UserCardSwitch = (AuthUser) => {
  switch (AuthUser.users?.userType) {
    case 0:
      return <VoterCard />;
    case 1:
      return <CircleCard />;
    case 2:
      return <FLinkCard />;
    case 3:
      console.log("case sec del.");
      return;
    default:
      console.log("default case here...");
      return;
  }
};

export default function Wrapper() {
  const AuthUser = useSelector((state) => state.AuthUser.user);
  return <Container>{UserCardSwitch(AuthUser)}</Container>;
}
