import { useState } from "react";

type Location = {
  lat: number;
  lng: number;
};

type Facility = {
  name: string;
  address: string;
};

type ReferralResult = {
  mode: "online" | "offline";
  facility: Facility;
};

export default function Referral() {
  const [location, setLocation] = useState<Location | null>(null);
  const [severity, setSeverity] = useState<"mild" | "severe">("mild");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ReferralResult | null>(null);
  const [error, setError] = useState<string>("");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setError("");
      },
      () => setError("Location access denied")
    );
  };

  const findFacility = async () => {
    if (!location) {
      setError("Please allow location access first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/referral?lat=${location.lat}&lng=${location.lng}&severity=${severity}`
      );

      const data: ReferralResult = await res.json();
      setResult(data);
    } catch {
      setError("Failed to fetch referral");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🏥 Referral Guidance</h2>

      <button onClick={getLocation}>📍 Get My Location</button>

      {location && (
        <p>
          Location: {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
        </p>
      )}

      <label>Severity</label>
      <select
        value={severity}
        onChange={(e) => setSeverity(e.target.value as "mild" | "severe")}
      >
        <option value="mild">Mild</option>
        <option value="severe">Severe</option>
      </select>

      <button onClick={findFacility} disabled={loading}>
        {loading ? "Finding..." : "Find Nearest Facility"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {result && (
        <div style={styles.card}>
          <h3>{result.facility.name}</h3>
          <p>{result.facility.address}</p>
          <p>
            Mode:{" "}
            <strong>
              {result.mode === "online" ? "🌐 Online" : "📴 Offline"}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center" as const
  },
  card: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  },
  error: {
    color: "red",
    marginTop: "10px"
  }
};