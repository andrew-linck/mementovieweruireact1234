import { connect } from "react-redux";
import MainContent from "./MainContent";

function mapStateToProps(state) {
  return {
    drawerIsOpen: state.app_wide_settings.is_open,
    drawerIsTransitioning: state.app_wide_settings.is_transitioning,
    transitionTime: state.app_wide_settings.transition_time,
    neatline: state.app_wide_settings.neatlines,
    neatline_color: 0x7f0000ff,
    servers: state.servers,
  };
}

export default connect(mapStateToProps)(MainContent);
