"use client";

import { useState } from "react";
import type { CreatorProfile, SoroTipClient } from "@sorotip/sdk";

interface ProfileEditorProps {
  client: SoroTipClient;
  profile?: CreatorProfile;
  onSaved?: () => void;
}

/** Form for registering or updating a creator's public profile. */
export default function ProfileEditor({ client, profile, onSaved }: ProfileEditorProps) {
  const [name, setName] = useState(profile?.name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatarIpfs, setAvatarIpfs] = useState(profile?.avatarIpfs ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const isEditing = Boolean(profile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setError(undefined);
    setIsSaving(true);
    try {
      const params = { name: name.trim(), bio: bio.trim(), avatarIpfs: avatarIpfs.trim() };
      if (isEditing) {
        await client.updateProfile(params);
      } else {
        await client.registerCreator(params);
      }
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-tip-card p-5">
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400" htmlFor="profile-name">
          Name
        </label>
        <input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400" htmlFor="profile-bio">
          Bio
        </label>
        <textarea
          id="profile-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Tell supporters what you do"
          className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400" htmlFor="profile-avatar">
          Avatar IPFS hash
        </label>
        <input
          id="profile-avatar"
          value={avatarIpfs}
          onChange={(e) => setAvatarIpfs(e.target.value)}
          placeholder="Qm..."
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500"
        />
      </div>
      <button
        type="submit"
        disabled={isSaving}
        className="rounded-full bg-tip-orange py-2.5 text-sm font-semibold text-black transition hover:bg-tip-orange/90 disabled:opacity-50"
      >
        {isSaving ? "Saving…" : isEditing ? "Save changes" : "Create profile"}
      </button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
