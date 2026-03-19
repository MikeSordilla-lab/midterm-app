// import { Image } from "expo-image";
// import { Platform, StyleSheet } from "react-native";

// import { Collapsible } from "@/components/ui/collapsible";
// import { ExternalLink } from "@/components/external-link";
// import ParallaxScrollView from "@/components/parallax-scroll-view";
// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
// import { IconSymbol } from "@/components/ui/icon-symbol";
// import { Fonts } from "@/constants/theme";

// export default function TabTwoScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
//       headerImage={
//         <IconSymbol
//           size={310}
//           color="#808080"
//           name="chevron.left.forwardslash.chevron.right"
//           style={styles.headerImage}
//         />
//       }
//     >
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText
//           type="title"
//           style={{
//             fontFamily: Fonts.rounded,
//           }}
//         >
//           📚 Student Management System
//         </ThemedText>
//       </ThemedView>
//       <ThemedText>
//         Complete CRUD system with MySQL, PHP API, and Expo mobile app.
//       </ThemedText>

//       <Collapsible title="🚀 Getting Started">
//         <ThemedText>
//           This app is part of a complete Student Management System. The main tab
//           shows all students with full CRUD capabilities.
//         </ThemedText>
//         <ThemedText style={{ marginTop: 10 }}>
//           <ThemedText type="defaultSemiBold">First steps:</ThemedText>
//         </ThemedText>
//         <ThemedText>1. Start XAMPP (Apache & MySQL)</ThemedText>
//         <ThemedText>2. Visit http://localhost/midterm-api/setup.php</ThemedText>
//         <ThemedText>
//           3. Check the Students tab to view and manage records
//         </ThemedText>
//       </Collapsible>

//       <Collapsible title="🗄️ Database">
//         <ThemedText>
//           <ThemedText type="defaultSemiBold">Database: student_db</ThemedText>
//         </ThemedText>
//         <ThemedText>
//           <ThemedText type="defaultSemiBold">Table: student_list</ThemedText>
//         </ThemedText>
//         <ThemedView
//           style={{
//             backgroundColor: "#f5f5f5",
//             borderRadius: 4,
//             padding: 10,
//             marginTop: 8,
//           }}
//         >
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 6 }}
//           >
//             id (INT)
//           </ThemedText>
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 6 }}
//           >
//             firstname (VARCHAR 50)
//           </ThemedText>
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 6 }}
//           >
//             lastname (VARCHAR 50)
//           </ThemedText>
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 6 }}
//           >
//             ratings (INT 0-20000)
//           </ThemedText>
//           <ThemedText style={{ fontFamily: Fonts.mono, fontSize: 12 }}>
//             last_update (DATETIME)
//           </ThemedText>
//         </ThemedView>
//       </Collapsible>

//       <Collapsible title="🔌 API Endpoints">
//         <ThemedText>
//           <ThemedText type="defaultSemiBold">Base URL:</ThemedText>
//         </ThemedText>
//         <ThemedView
//           style={{
//             backgroundColor: "#f5f5f5",
//             borderRadius: 4,
//             padding: 10,
//             marginTop: 8,
//             marginBottom: 10,
//           }}
//         >
//           <ThemedText style={{ fontFamily: Fonts.mono, fontSize: 12 }}>
//             http://localhost/midterm-api/api/
//           </ThemedText>
//         </ThemedView>
//         <ThemedText>
//           <ThemedText type="defaultSemiBold">Endpoints:</ThemedText>
//         </ThemedText>
//         <ThemedView
//           style={{
//             backgroundColor: "#f5f5f5",
//             borderRadius: 4,
//             padding: 10,
//             marginTop: 8,
//           }}
//         >
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 6 }}
//           >
//             GET /students.php
//           </ThemedText>
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 6 }}
//           >
//             POST /create_student.php
//           </ThemedText>
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 6 }}
//           >
//             POST /update_student.php
//           </ThemedText>
//           <ThemedText style={{ fontFamily: Fonts.mono, fontSize: 12 }}>
//             POST /delete_student.php
//           </ThemedText>
//         </ThemedView>
//       </Collapsible>

//       <Collapsible title="🌐 Web Frontend">
//         <ThemedText>Access the web interface at:</ThemedText>
//         <ThemedView
//           style={{
//             backgroundColor: "#f5f5f5",
//             borderRadius: 4,
//             padding: 10,
//             marginTop: 8,
//             marginBottom: 10,
//           }}
//         >
//           <ThemedText style={{ fontFamily: Fonts.mono, fontSize: 12 }}>
//             http://localhost/midterm-api/
//           </ThemedText>
//         </ThemedView>
//         <ThemedText>
//           The web version provides the same CRUD functionality with an enhanced
//           UI design.
//         </ThemedText>
//       </Collapsible>

//       <Collapsible title="📱 App Features">
//         <ThemedText>
//           <ThemedText type="defaultSemiBold">Main Features:</ThemedText>
//         </ThemedText>
//         <ThemedText>✓ View all students</ThemedText>
//         <ThemedText>✓ Search by name or ID</ThemedText>
//         <ThemedText>✓ Pull-to-refresh</ThemedText>
//         <ThemedText>✓ Add new student</ThemedText>
//         <ThemedText>✓ Edit existing student</ThemedText>
//         <ThemedText>✓ Delete student</ThemedText>
//         <ThemedText>✓ Input validation</ThemedText>
//         <ThemedText>✓ Real-time updates</ThemedText>
//       </Collapsible>

//       <Collapsible title="🔧 For Real Device">
//         <ThemedText>To use on a physical phone:</ThemedText>
//         <ThemedText style={{ marginTop: 10 }}>
//           <ThemedText type="defaultSemiBold">1. Find PC IP:</ThemedText>
//         </ThemedText>
//         <ThemedView
//           style={{
//             backgroundColor: "#f5f5f5",
//             borderRadius: 4,
//             padding: 10,
//             marginTop: 8,
//           }}
//         >
//           <ThemedText style={{ fontFamily: Fonts.mono, fontSize: 12 }}>
//             Windows CMD: ipconfig
//           </ThemedText>
//         </ThemedView>
//         <ThemedText style={{ marginTop: 10 }}>
//           <ThemedText type="defaultSemiBold">
//             2. Edit services/api.ts
//           </ThemedText>
//         </ThemedText>
//         <ThemedText>
//           Update BASE_URL with your IP address (192.168.x.x)
//         </ThemedText>
//         <ThemedText style={{ marginTop: 10 }}>
//           <ThemedText type="defaultSemiBold">3. Ensure:</ThemedText>
//         </ThemedText>
//         <ThemedText>✓ Phone and PC on same WiFi</ThemedText>
//         <ThemedText>✓ Firewall allows Apache</ThemedText>
//       </Collapsible>

//       <Collapsible title="⚡ Commands">
//         <ThemedView
//           style={{
//             backgroundColor: "#f5f5f5",
//             borderRadius: 4,
//             padding: 10,
//             marginTop: 8,
//           }}
//         >
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 8 }}
//           >
//             npm install
//           </ThemedText>
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 8 }}
//           >
//             npm start
//           </ThemedText>
//           <ThemedText
//             style={{ fontFamily: Fonts.mono, fontSize: 12, marginBottom: 8 }}
//           >
//             npm run web
//           </ThemedText>
//           <ThemedText style={{ fontFamily: Fonts.mono, fontSize: 12 }}>
//             npm run android
//           </ThemedText>
//         </ThemedView>
//       </Collapsible>

//       <Collapsible title="✅ Checklist">
//         <ThemedText>□ XAMPP Apache running</ThemedText>
//         <ThemedText>□ XAMPP MySQL running</ThemedText>
//         <ThemedText>□ Database setup completed</ThemedText>
//         <ThemedText>□ Can view students</ThemedText>
//         <ThemedText>□ Can add student</ThemedText>
//         <ThemedText>□ Can edit student</ThemedText>
//         <ThemedText>□ Can delete student</ThemedText>
//       </Collapsible>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   headerImage: {
//     color: "#808080",
//   },
// });
