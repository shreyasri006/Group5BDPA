useEffect(() => {
  // load from public (Vite serves /public at root)
  fetch("/university_colors.json")
    .then((r) => {
      if (!r.ok) throw new Error(`status ${r.status}`);
      return r.json();
    })
    .then((data) => setSchools(data))
    .catch((e) => {
      console.warn("Failed loading university colors from /university_colors.json:", e);
      setSchools([]);
    });

  // restore selection if saved
  try {
    const saved = localStorage.getItem("selectedSchool");
    if (saved) setSelected(JSON.parse(saved));
  } catch (e) {
    // ignore
  }
}, []);