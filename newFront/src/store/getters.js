const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  user: state => state.user.user,
  team: state => state.user.team,
  name: state => state.user.name,
  config: state => state.config.config,
  is_tool: state => state.config.is_tool,
  is_personal: state => state.config.is_personal,
  match: state => state.match.match
}
export default getters
