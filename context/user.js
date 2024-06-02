"use client";

import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Context = createContext();

const Provider = ({ children }) => {
  const router = useRouter();

  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [picture, setPicture] = useState(null);

  const supabaseClient = createClientComponentClient();

  const getCurrentSession = async () => {
    const res = await supabaseClient.auth.getSession();

    if (res && res.data.session) {
      return res.data.session;
    }
    clearUser();
    return null;
  };

  const getCurrentUser = async () => {
    if (id) return;

    const res = await supabaseClient.auth.getUser();

    if (res && res.data.user) {
      const authUser = res.data.user;

      setUser(authUser);
      setId(authUser.id);
      setEmail(authUser.email);
      setName(authUser.identities[0].identity_data.name);
      setPicture(authUser.identities[0].identity_data.picture);
    }
  };

  useEffect(() => {
    const isUser = async () => {
      const currentSession = await getCurrentSession();

      if (currentSession) await getCurrentUser();
    };

    isUser();
  }, []);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    clearUser();
    router.push("/");
  };

  const clearUser = () => {
    setId(null);
    setUser(null);
    setEmail(null);
    setName(null);
    setPicture(null);
  };

  const exposed = { user, id, email, name, picture, signOut };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
