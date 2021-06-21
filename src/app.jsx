import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { HoverButtonDiagonal } from "react-hover-button";
 
function App() {
  const hoverBtn = useRef(null);
  const [loading, switchLoading] = useState(false);

  var DISCORD_URL = "https://discord.gg/qXWHXbm";
  var FACEBOOK_URL = "https://www.facebook.com/playapexps/";
  var INSTAGRAM_URL = "https://www.instagram.com/play_apexps/";
  var DOWNLOAD_URL = "https://playapex.net/static/RSPS/Apex-client.jar?time="+Date.now();
  var HASH_URL = "https://playapex.net/static/RSPS/client_hash.txt?time="+Date.now();
  var SAVE_NAME = "Apex-client.jar";
//   var SAVE_LOCATION = System.getProperty("user.home") + File.separator + "Apex-client.jar";
  var HOME_URL = "https://www.playapex.net/";
  var FORUM_URL = "https://www.playapex.net/forums/";
  var STORE_URL = "https://www.playapex.net/store/";
  var VOTE_URL = "https://www.playapex.net/vote/";
  var WIKI_URL = "https://apexps.fandom.com/";

  useEffect(_ => {
    hoverBtn.current.addEventListener(
      "click",
      _ => switchLoading(prev => !prev),
      false
    );
  }, []);

  function check() {
    api.sendMessage("Check this guys application")
    .then(data => {
        if(data) {
          console.log(Date.now())
            console.log(data);
        }
        if (!data.isJREInstalled) {
          alert("Java is not installed, please download jre 1.8 in order to get the client running.")
        }
        if (data.isHTTPSBlocked) {
          alert("HTTPS downloading is getting blocked somehow, Best thing you can do is to download the client manually via 'https://playapex.net/static/RSPS/Apex-client.jar'.")
        }
        if (data.error) {
          alert("Either the website is down, or your downloading permissions are not to date. Best thing you can do is to download the client manually via 'https://playapex.net/static/RSPS/Apex-client.jar'")
        }
    }).catch(err  => {
        console.log(err);
    });
}
 
  return (
    <div >
        <div ref={hoverBtn}> 
      <HoverButtonDiagonal onClick={check} width={300} disabled={false} color="#000" loading={loading} style={{position: 'absolute', right: '335px', bottom: '30px'}}>
      </HoverButtonDiagonal>
      </div>
        
      <HoverButtonDiagonal width={90} maskColor="#FFCD00" color="#000" style={{position: 'absolute', left: '402px', bottom: '330px'}}>
      <a href={WIKI_URL} target="_blank">Wiki</a>
      </HoverButtonDiagonal>

      <HoverButtonDiagonal width={90} maskColor="#FFCD00" color="#000" style={{position: 'absolute', left: '498px', bottom: '330px'}}>
      <a href={DISCORD_URL} target="_blank">Discord</a>
      </HoverButtonDiagonal>

      <HoverButtonDiagonal width={90} maskColor="#FFCD00" color="#000" style={{position: 'absolute', left: '402px', bottom: '240px'}}>
      <a href={STORE_URL} target="_blank">Store</a>
      </HoverButtonDiagonal>

      <HoverButtonDiagonal width={90} maskColor="#FFCD00" color="#000" style={{position: 'absolute', left: '498px', bottom: '240px'}}>
      <a href={VOTE_URL} target="_blank">Vote</a>
      </HoverButtonDiagonal>

      <HoverButtonDiagonal width={90} maskColor="#FFCD00" color="#000" style={{position: 'absolute', left: '402px', bottom: '150px'}}>
      <a href={FACEBOOK_URL} target="_blank">Facebook</a>
      </HoverButtonDiagonal>

      <HoverButtonDiagonal width={90} maskColor="#FFCD00" color="#000" style={{position: 'absolute', left: '498px', bottom: '150px'}}>
      <a href={INSTAGRAM_URL} target="_blank">Instagram</a>
      </HoverButtonDiagonal>
      
    </div>
  );
  
}
render(<App />, document.body);