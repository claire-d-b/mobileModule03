import { Stack } from "expo-router";

// RootLayout est le composant racine que Expo Router utilise automatiquement pour englober toutes les routes de l'app.
// <Stack ... /> déclare que la navigation globale se fera en mode "pile" — chaque fichier dans app/
// (comme login.tsx, home.tsx, register.tsx) devient automatiquement un écran accessible dans cette pile,
// sans avoir à les déclarer manuellement (contrairement à React Navigation "classique" où tu listes chaque écran toi-même).
// screenOptions={{ headerShown: false }} : configuration appliquée à tous les écrans de cette pile — ici,
// ça masque la barre d'en-tête native par défaut (le bandeau du haut avec titre et bouton retour) sur chaque écran.
// C'est courant quand tu construis ta propre UI de header personnalisée dans chaque écran, plutôt que d'utiliser
// celle fournie par défaut.
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
