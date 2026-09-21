import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Player } from "@lordicon/react";
import animationData from "../assets/doodle-black-49-plus-circle-hover-pinch.json";
import animationData1 from "../assets/search.json";

interface PasswordEntry {
  site: string;
  username: string;
  password: string;
}

// 1. Structural template for tracking exactly which field was copied
interface CopiedState {
  index: number;
  field: "site" | "username" | "password";
}

const Manager: React.FC = () => {
  const playerRef = useRef<Player>(null);
  const searchPlayerRef = useRef<Player>(null);

  const [passwordArray, setPasswordArray] = useState<PasswordEntry[]>(() => {
    const passwords = localStorage.getItem("passwords");
    return passwords ? (JSON.parse(passwords) as PasswordEntry[]) : [];
  });

  const [form, setform] = useState<PasswordEntry>({
    site: "",
    username: "",
    password: "",
  });

  // 2. State to hold the currently active copied item tracking
  const [copiedItem, setCopiedItem] = useState<CopiedState | null>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
    searchPlayerRef.current?.playFromBeginning();
  }, []);

  const handleHover = (): void => {
    playerRef.current?.playFromBeginning();
    searchPlayerRef.current?.playFromBeginning();
  };

  const handleSearchHover = (): void => {
    searchPlayerRef.current?.playFromBeginning();
  };

  // 3. Helper to write data to clipboard and trigger the temporary tick state
  const copyText = (
    text: string,
    index: number,
    field: "site" | "username" | "password",
  ) => {
    navigator.clipboard.writeText(text);
    setCopiedItem({ index, field });

    // Revert back to the copy icon after 2 seconds
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

  const savePassword = (): void => {
    if (!form.site.trim() || !form.username.trim() || !form.password.trim()) {
      alert("All fields (Website, Username, and Password) are required!");
      return;
    }
    const updatedArray = [...passwordArray, form];
    setPasswordArray(updatedArray);
    localStorage.setItem("passwords", JSON.stringify(updatedArray));
    setform({ site: "", username: "", password: "" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="manager">
      <div className="main">
        <div className="texts">
          <p>Your own</p>
          <span>Password Manager</span>
        </div>
        <div className="search" onMouseEnter={handleSearchHover}>
          <input
            type="text"
            placeholder="Search website"
            className="search_item"
          />
          <div className="btn_design">
            <Player
              ref={searchPlayerRef}
              icon={animationData1}
              size={50}
              colorize="#000000"
            />
          </div>
        </div>
        <div className="inputs" onMouseEnter={handleSearchHover}>
          <input
            value={form.site}
            onChange={handleChange}
            type="text"
            name="site"
            placeholder="Enter website"
            className="inputs_item"
            required
          />
          <input
            value={form.username}
            onChange={handleChange}
            type="text"
            name="username"
            placeholder="Enter Username"
            className="inputs_item"
            required
          />
          <div className="pass">
            <input
              value={form.password}
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter Password"
              className="inputs_item"
              required
            />
          </div>
        </div>
        <button
          onClick={savePassword}
          className="btn"
          onMouseEnter={handleHover}
        >
          <div className="btn_design">
            <Player
              ref={playerRef}
              icon={animationData}
              size={50}
              colorize="#ffffff"
            />
          </div>
          Add Password
        </button>

        {passwordArray.length === 0 && (
          <div className="no_pass"> No Passwords to show</div>
        )}

        {passwordArray.length !== 0 && (
          <div className="pass">
            <h2>Your Passwords</h2>
            <table className="pass_table">
              <thead className="t-h">
                <tr className="t-h_r">
                  <th>Website URL</th>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody className="t-b">
                {passwordArray.map((item, index) => (
                  <tr key={index} className="t-b_r">
                    <td>
                      <div className="cell_content">
                        <a href={item.site} target="_blank" rel="noreferrer">
                          {item.site}
                        </a>
                        <img
                          src={
                            copiedItem?.index === index &&
                            copiedItem?.field === "site"
                              ? "src/assets/right.png"
                              : "src/assets/copy.png"
                          }
                          alt="Copy"
                          className={`copy_icon ${copiedItem?.index === index && copiedItem?.field === "site" ? "copied" : ""}`}
                          onClick={() => copyText(item.site, index, "site")}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="cell_content">
                        <span>{item.username}</span>
                        <img
                          src={
                            copiedItem?.index === index &&
                            copiedItem?.field === "username"
                              ? "src/assets/right.png"
                              : "src/assets/copy.png"
                          }
                          alt="Copy"
                          className={`copy_icon ${copiedItem?.index === index && copiedItem?.field === "username" ? "copied" : ""}`}
                          onClick={() =>
                            copyText(item.username, index, "username")
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="cell_content">
                        <span>{item.password}</span>
                        <img
                          src={
                            copiedItem?.index === index &&
                            copiedItem?.field === "password"
                              ? "src/assets/right.png"
                              : "src/assets/copy.png"
                          }
                          alt="Copy"
                          className={`copy_icon ${copiedItem?.index === index && copiedItem?.field === "password" ? "copied" : ""}`}
                          onClick={() =>
                            copyText(item.password, index, "password")
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Manager;
