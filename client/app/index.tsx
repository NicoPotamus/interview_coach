import { Text, View, TextInput } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-50">
      <Text className="text-3xl font-bold text-blue-800 mb-6">Enter a job title:</Text>
      <TextInput
        className="h-12 border border-gray-300 rounded-full px-4 w-3/4 shadow-md"
        placeholder="Job Title"
      />
    </View>
  );
}B
