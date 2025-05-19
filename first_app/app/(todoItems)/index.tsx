import React, { useCallback, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

import { styles } from '@/utils/todoItems/index.styles';
import { TodoItem } from '@/types/TodoItem';
import { Category } from '@/types/Category';
import { getCategories } from '@/utils/categories/apiClient';
import { getTodoItems } from '@/utils/todoItems/apiClient';
import { isErrorResponse } from '@/utils/apiClient';

export default function TodoItemsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

  async function loadData() {
    const [todoRes, catRes] = await Promise.all([getTodoItems(), getCategories()]);

    if (!isErrorResponse(todoRes)) {
      setTodoItems(todoRes);
    }

    if (!isErrorResponse(catRes)) {
      setCategories(catRes);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const filteredItems = selectedCategory
    ? todoItems.filter(t => t.categoryGuid === selectedCategory)
    : todoItems;

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(value) => setSelectedCategory(value)}
        style={styles.picker}
      >
        <Picker.Item label="Alle Kategorien" value={null} />
        {categories.map(cat => (
          <Picker.Item key={cat.guid} label={cat.name} value={cat.guid} />
        ))}
      </Picker>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.guid.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}
