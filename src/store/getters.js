/* 
  建立了对子模块的快捷访问
*/

const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  //token: (state) => state.user.token,
  //avatar: (state) => state.user.avatar,
  //name: (state) => state.user.name,
};
export default getters;