import { connect } from "react-redux";
import LeftDrawer from "./LeftDrawer.jsx";
import { left_drawer_set_current_tab } from "./actions";

function mapStateToProps(state) {
  return {
    drawerIsOpen: state.app_wide_settings.is_open,
    currentTab: state.app_wide_settings.current_tab,
    drawerIsTransitioning: state.app_wide_settings.is_transitioning,
    layers: state.servers,
  };
}

const mapDispatchToProps = {
  setCurrentTab: left_drawer_set_current_tab,
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDrawer);
