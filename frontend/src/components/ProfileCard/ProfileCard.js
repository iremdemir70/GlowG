import React, { useState, useEffect } from 'react';
import './ProfileCard.css';

const ProfileCard = ({
  email,
  profile,
  skinTypes,
  skinTones,
  isEditing,
  setIsEditing,
  setProfile,
  updateProfile,
  handleLogout,
}) => {
  // Local state ile profile güncellemesi için kopya oluşturuyoruz
  const [localProfile, setLocalProfile] = useState({
    skin_type_id: '',
    skin_tone_id: '',
    allergens: [],
  });

  useEffect(() => {
    if (profile) {
      setLocalProfile({
        skin_type_id: profile.skin_type_id || '',
        skin_tone_id: profile.skin_tone_id || '',
        allergens: profile.allergens || [],
      });
    }
  }, [profile]);

  // Allergens input string haline getiriliyor
  const allergensString = (localProfile.allergens || []).join(', ');

  // Değişiklikleri local state'te tutup, updateProfile fonksiyonuna göndermek için
  const handleChange = (field, value) => {
    setLocalProfile(prev => ({
      ...prev,
      [field]: field === 'allergens' ? value.split(',').map(item => item.trim()) : value,
    }));
  };

  const onUpdateClick = () => {
    updateProfile(localProfile);
  };

  return (
    <div id="profileCard" className="card-container">
      <h2>Profile</h2>

      <input type="email" value={email || ''} readOnly />

      {/* Skin Type */}
      <select
        value={isEditing ? localProfile.skin_type_id : profile?.skin_type_id || ''}
        onChange={e => isEditing && handleChange('skin_type_id', parseInt(e.target.value))}
        disabled={!isEditing}
      >
        {!isEditing && (
          <option>{profile?.skin_type_name || 'Not set'}</option>
        )}
        {isEditing && (
          <>
            <option value="">Select skin type</option>
            {skinTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </>
        )}
      </select>

      {/* Skin Tone */}
      <select
        value={isEditing ? localProfile.skin_tone_id : profile?.skin_tone_id || ''}
        onChange={e => isEditing && handleChange('skin_tone_id', parseInt(e.target.value))}
        disabled={!isEditing}
      >
        {!isEditing && (
          <option>{profile?.skin_tone_name || 'Not set'}</option>
        )}
        {isEditing && (
          <>
            <option value="">Select skin tone</option>
            {skinTones.map(tone => (
              <option key={tone.id} value={tone.id}>{tone.name}</option>
            ))}
          </>
        )}
      </select>

      {/* Allergens */}
      <input
        type="text"
        placeholder="Allergens: Paraben, Alcohol, etc."
        value={allergensString}
        onChange={e => isEditing && handleChange('allergens', e.target.value)}
        readOnly={!isEditing}
      />

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <a href="/update-password" id="changePasswordLink">Change Password</a>
      </div>

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      ) : (
        <>
          <button onClick={onUpdateClick}>Update</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      )}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default ProfileCard;
