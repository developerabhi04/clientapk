import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StatusBar,
    Alert,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditProfileScreen = ({ navigation }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [profile, setProfile] = useState({
        firstName: 'Abhishek',
        lastName: 'Kumar ',
        email: 'abhishek@example.com',
        phone: '+91 98765 43210',
        bio: 'Passionate investor and trader',
        location: 'New Delhi, India',
        occupation: 'Software Developer',
        profileImage: 'https://via.placeholder.com/120',
    });

    const [tempProfile, setTempProfile] = useState(profile);

    const handleSave = () => {
        if (!tempProfile.firstName.trim()) {
            Alert.alert('Validation', 'First name is required');
            return;
        }
        if (!tempProfile.email.trim() || !tempProfile.email.includes('@')) {
            Alert.alert('Validation', 'Valid email is required');
            return;
        }

        setIsSaving(true);
        setTimeout(() => {
            setProfile(tempProfile);
            setIsEditing(false);
            setIsSaving(false);
            Alert.alert('Success', 'Profile updated successfully!');
        }, 1500);
    };

    const handleCancel = () => {
        setTempProfile(profile);
        setIsEditing(false);
    };

    const handleFieldChange = (field, value) => {
        setTempProfile({ ...tempProfile, [field]: value });
    };

    const memberSince = 'November 2024';
    const accountStatus = 'Active';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.safeAreaTop}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    {!isEditing ? (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                                setTempProfile(profile);
                                setIsEditing(true);
                            }}>
                            <Icon name="pencil" size={20} color="#00C896" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.headerRight} />
                    )}
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: profile.profileImage }}
                            style={styles.avatar}
                        />
                        {isEditing && (
                            <TouchableOpacity style={styles.avatarEditButton}>
                                <Icon name="camera-plus" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.fullName}>
                        {isEditing ? tempProfile.firstName : profile.firstName} {isEditing ? tempProfile.lastName : profile.lastName}
                    </Text>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>{accountStatus}</Text>
                    </View>
                </View>

                {/* Account Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Icon name="calendar-check" size={24} color="#00C896" />
                        <Text style={styles.statLabel}>Member Since</Text>
                        <Text style={styles.statValue}>{memberSince}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="check-circle" size={24} color="#2196F3" />
                        <Text style={styles.statLabel}>Account Status</Text>
                        <Text style={styles.statValue}>{accountStatus}</Text>
                    </View>
                </View>

                {/* Personal Information Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="account-circle" size={20} color="#00C896" />
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                    </View>

                    {/* First Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>First Name</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="card-account-details" size={20} color="#00C896" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter first name"
                                placeholderTextColor="#666666"
                                value={isEditing ? tempProfile.firstName : profile.firstName}
                                onChangeText={(value) => handleFieldChange('firstName', value)}
                                editable={isEditing}
                            />
                        </View>
                    </View>

                    {/* Last Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Last Name</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="card-account-details" size={20} color="#00C896" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter last name"
                                placeholderTextColor="#666666"
                                value={isEditing ? tempProfile.lastName : profile.lastName}
                                onChangeText={(value) => handleFieldChange('lastName', value)}
                                editable={isEditing}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="email" size={20} color="#2196F3" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter email address"
                                placeholderTextColor="#666666"
                                value={isEditing ? tempProfile.email : profile.email}
                                onChangeText={(value) => handleFieldChange('email', value)}
                                editable={isEditing}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="phone" size={20} color="#FF9800" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter phone number"
                                placeholderTextColor="#666666"
                                value={isEditing ? tempProfile.phone : profile.phone}
                                onChangeText={(value) => handleFieldChange('phone', value)}
                                editable={isEditing}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </View>

                {/* Professional Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="briefcase" size={20} color="#9C27B0" />
                        <Text style={styles.sectionTitle}>Professional Information</Text>
                    </View>

                    {/* Occupation */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Occupation</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="briefcase" size={20} color="#9C27B0" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter occupation"
                                placeholderTextColor="#666666"
                                value={isEditing ? tempProfile.occupation : profile.occupation}
                                onChangeText={(value) => handleFieldChange('occupation', value)}
                                editable={isEditing}
                            />
                        </View>
                    </View>

                    {/* Bio */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Bio</Text>
                        <View style={[styles.inputContainer, styles.bioContainer]}>
                            <Icon name="pencil" size={20} color="#F44336" />
                            <TextInput
                                style={[styles.input, styles.bioInput]}
                                placeholder="Write a short bio about yourself"
                                placeholderTextColor="#666666"
                                value={isEditing ? tempProfile.bio : profile.bio}
                                onChangeText={(value) => handleFieldChange('bio', value)}
                                editable={isEditing}
                                multiline={true}
                                numberOfLines={3}
                            />
                        </View>
                        <Text style={styles.charCount}>
                            {isEditing ? tempProfile.bio.length : profile.bio.length}/160
                        </Text>
                    </View>

                    {/* Location */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Location</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="map-marker" size={20} color="#F44336" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter location"
                                placeholderTextColor="#666666"
                                value={isEditing ? tempProfile.location : profile.location}
                                onChangeText={(value) => handleFieldChange('location', value)}
                                editable={isEditing}
                            />
                        </View>
                    </View>
                </View>

                {/* Account Settings Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="lock" size={20} color="#FF5252" />
                        <Text style={styles.sectionTitle}>Account Settings</Text>
                    </View>

                    <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
                        <View style={styles.settingLeft}>
                            <Icon name="lock-reset" size={20} color="#FF5252" />
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Change Password</Text>
                                <Text style={styles.settingDesc}>Update your password</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={20} color="#666666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
                        <View style={styles.settingLeft}>
                            <Icon name="bell" size={20} color="#2196F3" />
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Notifications</Text>
                                <Text style={styles.settingDesc}>Manage notification preferences</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={20} color="#666666" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
                        <View style={styles.settingLeft}>
                            <Icon name="shield-check" size={20} color="#00C896" />
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>Privacy</Text>
                                <Text style={styles.settingDesc}>Control your privacy settings</Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={20} color="#666666" />
                    </TouchableOpacity>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Icon name="information" size={16} color="#2196F3" />
                    <Text style={styles.infoText}>
                        Keep your profile information up to date for better experience
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            {isEditing && (
                <SafeAreaView edges={['bottom']} style={styles.safeAreaBottom}>
                    <View style={styles.bottomButtonsContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                            activeOpacity={0.8}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={isSaving}
                            activeOpacity={0.8}>
                            {isSaving ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Icon name="check-circle" size={20} color="#FFFFFF" />
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    safeAreaTop: {
        backgroundColor: '#000000',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    editButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerRight: {
        width: 40,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 100,
    },

    // Profile Header
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 28,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
        marginBottom: 20,
    },

    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#00C896',
    },

    avatarEditButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#00C896',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#000000',
    },

    fullName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.3,
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D2B24',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00C896',
        gap: 6,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00C896',
    },

    statusText: {
        fontSize: 12,
        color: '#00C896',
        fontWeight: '700',
    },

    // Stats Container
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        gap: 12,
    },

    statCard: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    statLabel: {
        fontSize: 11,
        color: '#999999',
        marginTop: 6,
        marginBottom: 2,
        fontWeight: '600',
    },

    statValue: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '700',
        textAlign: 'center',
    },

    // Section
    section: {
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Input Group
    inputGroup: {
        marginBottom: 16,
    },

    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D0D0D',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        gap: 10,
    },

    bioContainer: {
        alignItems: 'flex-start',
        paddingVertical: 10,
    },

    input: {
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
        padding: 0,
    },

    bioInput: {
        paddingTop: 4,
        maxHeight: 80,
    },

    charCount: {
        fontSize: 11,
        color: '#666666',
        marginTop: 4,
        textAlign: 'right',
    },

    // Setting Item
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0D0D0D',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },

    settingInfo: {
        flex: 1,
    },

    settingTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 2,
    },

    settingDesc: {
        fontSize: 12,
        color: '#999999',
    },

    // Info Box
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1F2A',
        marginHorizontal: 16,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A3F5A',
        marginBottom: 20,
        gap: 10,
    },

    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#B3D9FF',
        lineHeight: 16,
        fontWeight: '500',
    },

    // Bottom Buttons
    safeAreaBottom: {
        backgroundColor: '#000000',
    },

    bottomButtonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        backgroundColor: '#000000',
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
    },

    cancelButton: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    saveButton: {
        flex: 1,
        backgroundColor: '#00C896',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },

    saveButtonDisabled: {
        backgroundColor: '#2A2A2A',
    },

    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
});

export default EditProfileScreen;
