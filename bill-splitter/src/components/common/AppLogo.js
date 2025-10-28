const AppLogo = ({ spinning = false }) => (
  <img 
    src="/SolLogo.jpg" 
    alt="SolSplit Logo" 
    className={spinning ? 'animate-spin' : ''} 
    style={{ animationDuration: '5s' }} 
  />
);

export default AppLogo;