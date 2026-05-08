# Novel Scenario Rules

## Core Schema Reminders

- Chapter scenes live in `src/data/scenes_chN.yaml`.
- Shared master data lives in `locations.yaml`, `characters.yaml`, `items.yaml`, `flags.yaml`, and `commands.yaml`.
- Every shared `locations.yaml` `entry_scene` must be defined in each chapter scenes file.
- `next_scene: null` means go back via history; if history is empty, the current scene becomes command phase.
- `messages: []` with `branches.type: auto` is a dispatcher scene.
- `talkable` is read only from the current scene when the player selects the Talk command.
- `characters` persists until another scene explicitly changes it, or `characters: []` clears it.

## Progression Pitfalls

- A visible character can be left on screen by a previous scene even when the current scene has no `talkable`. Clear characters in flavor-only scenes.
- A dispatcher scene can have `talkable`, but if it auto-transitions away, Talk will use the destination scene's `talkable`, not the dispatcher's.
- Chapter starts need all prerequisite flags and inventory implied by the chapter's story.
- Location connections can accidentally expose or hide a chapter route. Check chapter conditions after changing shared `locations.yaml`.
- Reward scenes after `next_engine` should grant items/flags and have a valid `return_scene`.
- Minigame or engine result flags such as `memory_game_result_*` and `runner_action_*` may be dynamic and are not always listed in `flags.yaml`.

## Patterns From This Project

- Use chapter-specific entry scenes with the same IDs as shared `locations.yaml` entries, e.g. `scene_ichibangai_default`.
- For a character present at a location, use both:
  ```yaml
  characters:
    - character_id: char_xxx
      position: center
      expression: normal
  talkable:
    - character_id: char_xxx
      scene_id: scene_chN_talk_xxx
  ```
- For flavor-only stop scenes after an auto dispatcher, add:
  ```yaml
  characters: []
  messages:
    - text: ...
      voice_character_id: char_hero
  next_scene: null
  ```
- For "N of these items" conditions, use the repository's `item_count` condition:
  ```yaml
  condition:
    item_count:
      items: [item_a, item_b, item_c]
      min: 2
  ```

## Validation

Run:

```bash
node .codex/skills/adjust-novel-scenario/scripts/validate_scenario.mjs src/data/scenes_ch4.yaml
```

Treat errors as blockers. Review warnings before deciding whether they are intentional.
