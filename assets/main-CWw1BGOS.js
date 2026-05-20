import{a as e,i as t,l as n,n as r,o as i}from"./js-yaml-DTURmwR3.js";var a=n(i(),1),o=e(),s=`scenes:
  - id: scene_danchi_morning
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_left_danchi
            value: false
          next_scene: scene_danchi_intro
        - condition:
            negate: true
            has_item: item_candy
          next_scene: scene_danchi_return_obachan
        - condition: null
    child_scenes:
      - id: scene_danchi_intro
        characters:
          - character_id: char_hero
            position: left
            expression: normal
        messages:
          - text: 今日はCoderDojo赤羽の開催日だ。
            voice_character_id: char_hero
          - text: あ、田村のおばちゃん。おはようございます！
            voice_character_id: char_hero
          - text: 「ケンちゃん、また出かけるの？ほら、これ持って行きな。」
            voice_character_id: char_obachan
            characters:
              - character_id: char_hero
                position: left
                expression: normal
              - character_id: char_obachan
                position: right
                expression: normal
          - text: アメちゃんをもらった！
            voice_character_id: null
        item_give:
          - item_id: item_suica
            condition: null
          - item_id: item_candy
            condition: null
        flags_set:
          - flag: flag_left_danchi
            value: true
        clickable_areas:
          - id: area_mailbox
            x: 187
            "y": 306
            width: 80
            height: 100
            label: 郵便受け
            next_scene: scene_examine_mailbox
            condition: null
          - id: area_danchi_funsui
            x: 339
            "y": 366
            width: 110
            height: 103
            label: 噴水
            next_scene: scene_examine_fountain
            condition: null
          - id: area_nazo01
            x: 450
            "y": 361
            width: 50
            height: 70
            label: "??"
            next_scene: scene_examine_hatena
            condition: null
        talkable:
          - character_id: char_obachan
            scene_id: scene_talk_danchi
        branches:
          type: none
      - id: scene_danchi_return_obachan
        characters:
          - character_id: char_hero
            position: left
            expression: normal
          - character_id: char_obachan
            position: right
            expression: normal
        commands:
          - cmd_examine
          - cmd_talk
          - cmd_move
          - cmd_inventory
        talkable:
          - character_id: char_obachan
            scene_id: scene_talk_danchi_gummy
            condition:
              flag: flag_yui_told_gummy
              value: true
          - character_id: char_obachan
            scene_id: scene_talk_danchi_give_candy
            condition:
              flag: flag_yui_told_gummy
              value: false
        messages:
          - text: おばちゃんが立っていた。
            voice_character_id: null
      - id: scene_talk_danchi_give_candy
        characters:
          - character_id: char_hero
            position: left
            expression: normal
          - character_id: char_obachan
            position: right
            expression: normal
        messages:
          - text: 「ケンちゃん、アメ食べちゃった？ほら、もう一個あるよ。」
            voice_character_id: char_obachan
          - text: アメをもらった！
            voice_character_id: null
        item_give:
          - item_id: item_candy
            condition: null
        next_scene: null
      - id: scene_talk_danchi_gummy
        characters:
          - character_id: char_hero
            position: left
            expression: normal
          - character_id: char_obachan
            position: right
            expression: normal
        messages:
          - text: 「おばちゃん、新発売のグミって知ってる？」
            voice_character_id: char_hero
          - text: 「グミ？なんだいそれ。」
            voice_character_id: char_obachan
          - text: 「なんか最近話題で……おばちゃんが持ってるの見たって聞いて。」
            voice_character_id: char_hero
          - text: 「んー……あたしゃよくわからないねえ。」
            voice_character_id: char_obachan
          - text: 「それよりケンちゃん、なんかのど渇いたねえ。」
            voice_character_id: char_obachan
        branches:
          type: auto
          choices:
            - condition:
                has_item: item_drink
              next_scene: scene_give_drink_to_obachan
            - condition: null
      - id: scene_give_drink_to_obachan
        characters:
          - character_id: char_hero
            position: left
            expression: normal
          - character_id: char_obachan
            position: right
            expression: normal
        messages:
          - text: ジュースを持っていた。おばちゃんに渡してみる。
            voice_character_id: null
          - text: 「あら、ありがとうねえ。」
            voice_character_id: char_obachan
          - text: おばちゃんはジュースをごくごく飲んだ。
            voice_character_id: null
          - text: 「……あっ、そういえば。」
            voice_character_id: char_obachan
          - text: 「ポケットに何か入ってたわ。これじゃないかい？」
            voice_character_id: char_obachan
          - text: おばちゃんのポケットから、グミが出てきた！
            voice_character_id: null
        item_remove:
          - item_drink
        item_give:
          - item_id: item_gummy
            condition: null
        next_scene: null
      - id: scene_examine_mailbox
        messages:
          - text: ケンの家の郵便受けだ。今日は特に何も入っていない。
            voice_character_id: null
        next_scene: null
      - id: scene_examine_fountain
        messages:
          - text: こんなところに噴水あったかな。
            voice_character_id: null
          - text: ほかに変わった情報はなさそうだ。
            voice_character_id: null
        next_scene: null
      - id: scene_talk_danchi
        messages:
          - text: 「ケンちゃん、気をつけてね。帰りが遅くなるんなら連絡しなさいよ。」
            voice_character_id: char_obachan
        next_scene: null
      - id: scene_examine_hatena
        messages:
          - text: |-
              なんだこれ　犬・・？
              まあいいか
            voice_character_id: char_hero
        location_id: loc_danchi
        next_scene: null
      - id: scene_examine_dog
        messages:
          - text: しかしなんだあいつ、、こっち見てるぞ
            voice_character_id: char_hero
        overlay_image: cg/dog.jpg
    clickable_areas:
      - id: area_danchi_dog
        x: 439
        "y": 348
        width: 71
        height: 79
        label: ""
        next_scene: scene_examine_dog
        condition: null
  - id: scene_station_default
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_gummy
          next_scene: scene_station_with_student
        - condition: null
          next_scene: scene_station_main
    child_scenes:
      - id: scene_station_main
        characters:
          - character_id: char_hero
            position: left
            expression: normal
        messages:
          - text: 赤羽駅の改札を出たところだ。
            voice_character_id: null
          - text: 休日の昼間、人が多く賑わっている。
            voice_character_id: null
        clickable_areas:
          - id: area_station_hiroba
            x: 254
            "y": 340
            width: 100
            height: 88
            label: 広場
            next_scene: scene_examine_station_hiroba
            condition: null
          - id: area_nazo02
            x: 397
            "y": 356
            width: 38
            height: 42
            label: ？？
            next_scene: scene_examine_station_nazo
            condition: null
        talkable:
          - character_id: char_yui
            scene_id: scene_talk_station
            condition:
              flag: flag_met_college_student
              value: false
        branches:
          type: none
        child_scenes:
          - id: scene_examine_station_hiroba
            messages:
              - text: 駅前の広場を見た。
                voice_character_id: null
              - text: ゴミが落ちているなかに、見覚えのあるチラシがある。
                voice_character_id: null
              - text: 「CoderDojo赤羽　本日開催！　参加無料　午前9時30分より」
                voice_character_id: null
                focus_overlay_image: cg/coderdojo_akabane_flyer.svg
              - text: チラシを一枚拾った！
                voice_character_id: null
            item_give:
              - item_id: item_flyer
                condition: null
            flags_set:
              - flag: flag_station_explored
                value: true
              - flag: flag_got_flyer
                value: true
            next_scene: null
          - id: scene_examine_station_nazo
            messages:
              - text: あれはなんだろう。。
                voice_character_id: null
              - text: なんでもいいか、、
                voice_character_id: null
            next_scene: null
          - id: scene_talk_station
            messages:
              - text: 辺りを見回すと……
                voice_character_id: null
            branches:
              type: auto
              choices:
                - label: ""
                  condition:
                    flag: flag_met_yui
                    value: true
                  next_scene: scene_yui_already_met
                - label: ""
                  condition: null
                  next_scene: scene_meet_yui
            child_scenes:
              - id: scene_meet_yui
                characters:
                  - character_id: char_yui
                    position: center
                    expression: surprise
                messages:
                  - text: 後ろから声がした。
                    voice_character_id: null
                  - text: 「あっ、ケンじゃん！やっぱりいた。」
                    voice_character_id: char_yui
                    voice_style: normal
                  - text: 「今日CoderDojo行くでしょ？チラシもう見た？」
                    voice_character_id: char_yui
                    voice_style: normal
                branches:
                  type: choice
                  choices:
                    - label: 「うん、見たよ。一緒に行こう！」
                      condition:
                        flag: flag_station_explored
                        value: true
                      next_scene: scene_yui_lets_go
                    - label: 「あ、まだ見てない。ちょっと待ってて」
                      condition: null
                      next_scene: null
                child_scenes:
                  - id: scene_yui_lets_go
                    characters:
                      - character_id: char_yui
                        position: center
                        expression: happy
                    messages:
                      - text: 「やった！じゃ行こう！CoderDojo楽しみだね！」
                        voice_character_id: char_yui
                        voice_style: normal
                      - text: ユイと合流した。
                        voice_character_id: null
                    flags_set:
                      - flag: flag_met_yui
                        value: true
                    branches:
                      type: none
              - id: scene_yui_already_met
                characters:
                  - character_id: char_yui
                    position: right
                    expression: happy
                messages:
                  - text: 「はーやーくー！行こうよ！」
                    voice_character_id: char_yui
                    voice_style: normal
                next_scene: null
      - id: scene_station_with_student
        characters:
          - character_id: char_hero
            position: left
            expression: normal
          - character_id: char_college_student
            position: right
            expression: normal
        messages:
          - text: 駅の広場に出ると、あの大学生がいた。
            voice_character_id: null
          - text: まだグミを探してウロウロしているみたいだ。
            voice_character_id: null
        talkable:
          - character_id: char_college_student
            scene_id: scene_talk_station_give_gummy
        branches:
          type: none
      - id: scene_talk_station_give_gummy
        characters:
          - character_id: char_hero
            position: left
            expression: normal
          - character_id: char_college_student
            position: right
            expression: normal
        messages:
          - text: 「あ、さっきの子！」
            voice_character_id: char_college_student
          - text: 「実は……これじゃないですか？」
            voice_character_id: char_hero
          - text: グミを取り出して、大学生に渡した。
            voice_character_id: null
          - text: 「え……っ！！これ、これだよ！！」
            voice_character_id: char_college_student
          - text: 「どこで！？どこにあったの！？」
            voice_character_id: char_college_student
          - text: 「団地のおばあさんが持ってて……」
            voice_character_id: char_hero
          - text: 「ありがとう！！ほんとにありがとう！！」
            voice_character_id: char_college_student
        item_remove:
          - item_gummy
        next_scene: scene_gummy_joy_cg
      - id: scene_gummy_joy_cg
        overlay_image: cg/gummy_joy.jpg
        messages:
          - text: 大学生の顔がぱっと明るくなった。
            voice_character_id: null
          - text: グミを口に入れて、しばらく目を閉じている。
            voice_character_id: null
          - text: 「……うまい。これだよ、これ。」
            voice_character_id: char_college_student
          - text: 「ありがとな。今日、最高の一日になったよ。」
            voice_character_id: char_college_student
          - text: ぼくも、なんかいい気持ちだった。
            voice_character_id: char_hero
          - text: グミひとつで、こんなことになるなんて。
            voice_character_id: char_hero
        next_scene: scene_ending_credits
      - id: scene_ending_credits
        bgm: audio/bgm/ending.mp3
        ending_title: 第1章　赤羽の一日
        messages: []
        game_end: true
        flags_set:
          - flag: flag_chapter1_cleared
            value: true
        cg_sequence:
          - src: cg/juice.jpg
            position: center
          - src: cg/game_man.jpg
            position: center
          - src: cg/happy_dojo.jpg
            position: center
          - src: cg/dog.jpg
            position: center
      - id: scene_ending_cg_sequence
        bgm: audio/bgm/ending.mp3
        ending_title: 第1章　赤羽の一日
        messages: []
        game_end: true
        cg_sequence:
          - src: cg/juice.jpg
            position: center
          - src: cg/game_man.jpg
            position: center
          - src: cg/happy_dojo.jpg
            position: center
          - src: cg/dog.jpg
            position: center
  - id: scene_coderdojo_default
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_hero
        position: left
        expression: normal
      - character_id: char_mentor
        position: right
        expression: normal
    messages:
      - text: CoderDojo赤羽の会場に着いた。
        voice_character_id: null
      - text: 広い部屋に子どもたちが集まって、みんなノートパソコンを開いている。
        voice_character_id: null
      - text: 「ケンくん、いらっしゃい！今日もよろしくね。」
        voice_character_id: char_mentor
        voice_style: normal
    clickable_areas:
      - id: area_whiteboard
        x: 339
        "y": 186
        width: 135
        height: 78
        label: ホワイトボード
        next_scene: scene_examine_whiteboard
        condition: null
      - id: area_kids
        x: 457
        "y": 267
        width: 290
        height: 133
        label: 子供たち
        next_scene: scene_examine_coderdojo_pcs
        condition: null
      - id: area_dojo_drink
        x: 90
        "y": 395
        width: 35
        height: 62
        label: ドリンク
        next_scene: scene_examine_dojo_drink
        condition: null
    flags_set:
      - flag: flag_arrived_coderdojo
        value: true
    talkable:
      - character_id: char_mentor
        scene_id: scene_talk_coderdojo
    branches:
      type: none
    child_scenes:
      - id: scene_examine_whiteboard
        messages:
          - text: ホワイトボードに「今日のテーマ：自由制作！」と書かれている。
            voice_character_id: null
          - text: 何を作ろうか……
            voice_character_id: null
        flags_set:
          - flag: flag_examined_whiteboard
            value: true
        next_scene: null
      - id: scene_examine_coderdojo_pcs
        messages:
          - text: ノートパソコンがずらりと並んでいる。
            voice_character_id: null
          - text: 隣の子のコードが見えた。ゲームっぽいものを作っているみたい。
            voice_character_id: null
        flags_set:
          - flag: flag_examined_kids
            value: true
        next_scene: null
      - id: scene_talk_coderdojo
        messages: []
        branches:
          type: auto
          choices:
            - label: ""
              condition:
                and:
                  - flag: flag_met_mentor
                    value: true
                  - flag: flag_examined_whiteboard
                    value: true
                  - flag: flag_examined_kids
                    value: true
              next_scene: scene_talk_coderdojo_mentor_bored
            - label: ""
              condition: null
              next_scene: scene_talk_coderdojo_mentor
      - id: scene_talk_coderdojo_mentor_bored
        messages:
          - text: 「……今日は気分がのらないな」
            voice_character_id: char_hero
            voice_style: normal
        next_scene: null
      - id: scene_talk_coderdojo_mentor
        messages:
          - text: 「今日のテーマは自由制作だよ。何か作りたいものある？」
            voice_character_id: char_mentor
            voice_style: normal
        branches:
          type: choice
          choices:
            - label: 「ゲームを作りたいです！」
              condition: null
              next_scene: scene_mentor_game_talk
            - label: 「まだ考え中です……」
              condition: null
              next_scene: scene_mentor_encouragement
        child_scenes:
          - id: scene_mentor_game_talk
            messages:
              - text: 「ゲームか！いいね！じゃあまず、どんなゲームにしたいか紙に描いてみよう。」
                voice_character_id: char_mentor
                voice_style: normal
              - text: 「作りたいものが決まったら、一緒に考えよう。」
                voice_character_id: char_mentor
                voice_style: normal
              - text: こうしてぼくのCoderDojoが始まった。
                voice_character_id: null
            flags_set:
              - flag: flag_met_mentor
                value: true
            next_scene: null
          - id: scene_mentor_encouragement
            messages:
              - text: 「大丈夫、焦らなくていいよ。まわりを見てインスピレーションを探してみて。」
                voice_character_id: char_mentor
                voice_style: normal
            flags_set:
              - flag: flag_met_mentor
                value: true
            next_scene: null
      - id: scene_examine_dojo_drink
        messages:
          - text: ラッキー　ドリンク見つけた
            voice_character_id: char_hero
        item_give:
          - item_id: item_drink
            condition: null
        next_scene: null
  - id: scene_use_candy
    overlay_image: cg/candy_happy.jpg
    item_remove:
      - item_candy
    messages:
      - text: アメをなめた。
        voice_character_id: null
      - text: 甘くておいしい。
        voice_character_id: null
      - text: ……なんだか、すごく幸せな気持ちになった。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_use_juice
    overlay_image: cg/happy_juice.jpg
    item_remove:
      - item_drink
    messages:
      - text: ジュースを飲んだ。
        voice_character_id: null
      - text: あっさりとしていて、とてもおいしい。
        voice_character_id: null
      - text: ……なんだか、すごく幸せな気持ちになった。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_slope_default
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/piano.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_visited_slope
            value: false
          next_scene: scene_slope_first_visit
        - condition:
            flag: flag_met_college_student
            value: true
          next_scene: scene_slope_with_yui
        - condition: null
          next_scene: scene_slope_with_student
    child_scenes:
      - id: scene_slope_first_visit
        characters:
          - character_id: char_hero
            position: left
            expression: normal
        messages:
          - text: ぼくはなんとなく坂道を歩いていた。
            voice_character_id: null
          - text: CoderDojoで教わったこと、ゲームを作るってどんな感じなんだろう。
            voice_character_id: char_hero
          - text: 坂の途中から、団地の建物が並ぶ景色が見えた。
            voice_character_id: null
          - text: この坂きついな、、
            voice_character_id: char_hero
        flags_set:
          - flag: flag_visited_slope
            value: true
        clickable_areas:
          - id: area_slope_view
            x: 300
            "y": 200
            width: 200
            height: 150
            label: 坂の眺め
            next_scene: scene_examine_slope_view
            condition: null
        branches:
          type: none
      - id: scene_examine_slope_view
        messages:
          - text: 赤羽の街が見渡せる。団地、線路、遠くにビル。
            voice_character_id: null
          - text: ここから見ると、自分がいつも歩いてる場所がちっぽけに見える。
            voice_character_id: char_hero
        next_scene: null
      - id: scene_slope_with_student
        characters:
          - character_id: char_hero
            position: left
            expression: normal
          - character_id: char_college_student
            position: right
            expression: normal
        messages:
          - text: 坂の途中に、見慣れない大学生がいた。
            voice_character_id: null
          - text: スマホを見ながらうろうろしている。
            voice_character_id: null
        talkable:
          - character_id: char_college_student
            scene_id: scene_talk_slope_student
        branches:
          type: none
      - id: scene_talk_slope_student
        messages:
          - text: 「ちょっといい？」
            voice_character_id: char_college_student
          - text: 「新発売のグミ探してるんだけど、この辺に売ってるとこ知らない？」
            voice_character_id: char_college_student
          - text: 「SNSで話題になってて……どうしても食べてみたくて。」
            voice_character_id: char_college_student
        flags_set:
          - flag: flag_met_college_student
            value: true
        branches:
          type: choice
          choices:
            - label: 「この辺、コンビニがあったような……」
              condition: null
              next_scene: scene_slope_student_hint
            - label: 「知らないです……」
              condition: null
              next_scene: scene_slope_student_unknown
        child_scenes:
          - id: scene_slope_student_hint
            messages:
              - text: 「ほんと！？どこ！？」
                voice_character_id: char_college_student
              - text: 「ありがとう、行ってみる！」
                voice_character_id: char_college_student
            next_scene: null
          - id: scene_slope_student_unknown
            messages:
              - text: 「そっかあ……じゃあもうちょっと探してみる。」
                voice_character_id: char_college_student
            next_scene: null
      - id: scene_slope_with_yui
        characters:
          - character_id: char_hero
            position: left
            expression: normal
          - character_id: char_yui
            position: right
            expression: normal
        messages:
          - text: 坂の途中に、ユイがいた。
            voice_character_id: null
          - text: 「あ、ケン！ここにいたんだ。」
            voice_character_id: char_yui
        talkable:
          - character_id: char_yui
            scene_id: scene_talk_slope_yui
        branches:
          type: none
      - id: scene_talk_slope_yui
        messages:
          - text: 「そういえばさ、新発売のグミって知ってる？」
            voice_character_id: char_hero
          - text: 「あのグミ、私も気になってた！どこで売ってるんだろうね。」
            voice_character_id: char_yui
          - text: 「たしか団地のおばちゃんもはまってるって聞いたよ。」
            voice_character_id: char_yui
          - text: 「団地に戻って、おばちゃんに聞いてみたら？」
            voice_character_id: char_yui
        flags_set:
          - flag: flag_yui_told_gummy
            value: true
        next_scene: null

  - id: scene_ichibangai_default
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    messages:
      - text: 一番街の入り口に来た。
        voice_character_id: null
      - text: アーケードの奥に商店が並んでいるが、今日は特に何もなさそうだ。
        voice_character_id: null
  - id: scene_park_default
    location_id: loc_park
    background: backgrounds/danchimae.jpg
    messages:
      - text: 公園に来た。今日はここでやることはなさそうだ。
        voice_character_id: null

  - id: scene_arcade_default
    location_id: loc_arcade
    background: backgrounds/intersection.jpg
    messages:
      - text: アーケード街は、今日はまだ静かだ。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_default
    location_id: loc_museum
    background: backgrounds/museum.jpg
    messages:
      - text: 団地のミュージアムは、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_plum_park_default
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    messages:
      - text: 梅の木公園は、今日は静まり返っている。
        voice_character_id: null
    next_scene: null

  - id: scene_station_end_default
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    messages:
      - text: 駅の端は、今日は特に変わったことはなさそうだ。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_core_default
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    messages:
      - text: ミュージアムの中心部は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_history_room_default
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 「赤羽の歴史」の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_portrait_room_default
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 「人々の肖像」の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_storage_room_default
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 収蔵庫は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_deep_core_default
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    messages:
      - text: ミュージアムの奥は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_yui_room_default
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 記憶の展示室は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_oyaji_room_default
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 古い道具の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null
`,c=`scenes:
  - id: scene_danchi_morning
    location_id: loc_danchi
    background: backgrounds/danchi_day.jpg
    bgm: audio/bgm/danchi.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_maze_defeated
                value: true
              - has_item: item_candy
                negate: true
          next_scene: scene_danchi_obachan
        - condition: null
          next_scene: scene_danchi_default
    child_scenes:
      - id: scene_danchi_default
        messages:
          - text: 団地に戻ってきた。
            voice_character_id: null
        background: backgrounds/danchimae.jpg
      - id: scene_danchi_obachan
        characters:
          - character_id: char_obachan
            position: left
            expression: normal
        messages:
          - text: 団地の廊下に出ると、向かいの田村のおばちゃんが立っていた。
            voice_character_id: null
          - text: 「あら、ケンちゃん。なんか元気ないねえ」
            voice_character_id: char_obachan
          - text: ……ちょっと、うまくいかなかったことがあって。
            voice_character_id: char_hero
          - text: 「そういうときはね、甘いもん食べたら元気出るよ。ほら、あめちゃんどうぞ」
            voice_character_id: char_obachan
          - text: ありがとう、おばちゃん。
            voice_character_id: char_hero
        item_give:
          - item_id: item_candy
            condition: null
        background: backgrounds/danchimae.jpg
  - id: scene_station_default
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 赤羽駅前に来た。
        voice_character_id: null
    child_scenes:
      - id: scene_examine_hatena
        messages:
          - text: きになるなあ　あれ。。
            voice_character_id: char_hero
      - id: scene_station_plaza_examine
        messages:
          - text: 駅前の広場をぼんやり眺めていたら、見覚えのある張り紙が目に入った。
            voice_character_id: null
          - text: 「CoderDojo赤羽、本日開催中——」
            voice_character_id: null
            focus_overlay_image: cg/coderdojo_akabane_flyer.svg
          - text: そうか、CoderDojoか。あそこなら何かヒントがあるかもしれない。
            voice_character_id: char_hero
        flags_set:
          - flag: flag_station_explored
            value: true
    clickable_areas:
      - id: area_1777816952489
        x: 391
        "y": 354
        width: 43
        height: 52
        label: ？？
        next_scene: scene_examine_hatena
        condition: null
      - id: area_station_plaza
        x: 183
        "y": 316
        width: 173
        height: 121
        label: 駅前の広場
        next_scene: scene_station_plaza_examine
        condition:
          flag: flag_maze_defeated
          value: true
  - id: scene_coderdojo_default
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_boss_challenged
                value: true
              - has_item: item_kinchu_hikari
                negate: true
          next_scene: scene_coderdojo_mentor_arrive
        - condition: null
          next_scene: scene_coderdojo_base
    child_scenes:
      - id: scene_coderdojo_mentor_arrive
        characters:
          - character_id: char_mentor
            position: center
            expression: smile
        messages:
          - text: CoderDojo赤羽の会場に入ると、田中メンターが立っていた。
            voice_character_id: null
          - text: 「あれ、ケン君。なんか思い詰めた顔してるね」
            voice_character_id: char_mentor
          - text: 迷宮のボスに負けました。どうしても勝てなくて。
            voice_character_id: char_hero
          - text: 「ボス、か。……実はね、前に似たような話を聞いたことがあるんだ」
            voice_character_id: char_mentor
          - text: 「ちょっと待ってて。棚の奥に何かあったはずだから」
            voice_character_id: char_mentor
        next_scene: scene_coderdojo_mentor_standby
      - id: scene_coderdojo_mentor_standby
        characters:
          - character_id: char_mentor
            position: center
            expression: smile
        messages:
          - text: 田中メンターが棚を探りながら、こちらを向いた。
            voice_character_id: null
        talkable:
          - character_id: char_mentor
            scene_id: scene_ch2_get_ofuda
        child_scenes:
          - id: scene_ch2_get_ofuda
            overlay_image: cg/get_superitem.jpg
            characters:
              - character_id: char_mentor
                position: center
                expression: smile
            messages:
              - text: 「あった。これ、持っていきな。困ったときに使うといい」
                voice_character_id: char_mentor
              - text: 手渡されたそれは、かすかに光を帯びていた。
                voice_character_id: null
              - text: 悪霊退散のおふだ　を手に入れた。
                voice_character_id: null
            item_give:
              - item_id: item_kinchu_hikari
                condition: null
            next_scene: scene_coderdojo_base
      - id: scene_coderdojo_base
        messages:
          - text: CoderDojo赤羽の会場は、今日は静かだった。
            voice_character_id: null
        next_scene: scene_coderdojo_examine_area
        child_scenes:
          - id: scene_coderdojo_examine_area
            messages: []
            clickable_areas:
              - id: area_coderdojo_juice
                x: 89
                "y": 394
                width: 52
                height: 70
                label: ジュース
                next_scene: scene_coderdojo_examine_juice
                condition: null
              - id: area_coderdojo_milktea
                x: 704
                "y": 390
                width: 87
                height: 69
                label: ティー
                next_scene: scene_coderdojo_examine_milktea
                condition: null
            background: backgrounds/coderdojo.jpg
          - id: scene_coderdojo_examine_juice
            messages: []
            branches:
              type: auto
              choices:
                - condition:
                    has_item: item_drink
                    negate: true
                  next_scene: scene_coderdojo_juice_get
                - condition: null
                  next_scene: scene_coderdojo_juice_have
            child_scenes:
              - id: scene_coderdojo_juice_get
                messages:
                  - text: 机の隅に、ジュースが置いてある。
                    voice_character_id: null
                  - text: もらっていいかな。
                    voice_character_id: char_hero
                  - text: ポケットに入れた。
                    voice_character_id: null
                item_give:
                  - item_id: item_drink
                    condition: null
                next_scene: scene_coderdojo_examine_area
              - id: scene_coderdojo_juice_have
                messages:
                  - text: 机の隅にジュースがある。もう持っているからいいか。
                    voice_character_id: char_hero
                next_scene: scene_coderdojo_examine_area
          - id: scene_coderdojo_examine_milktea
            messages: []
            branches:
              type: auto
              choices:
                - condition:
                    has_item: item_milktea
                    negate: true
                  next_scene: scene_coderdojo_milktea_get
                - condition: null
                  next_scene: scene_coderdojo_milktea_have
            child_scenes:
              - id: scene_coderdojo_milktea_get
                messages:
                  - text: ペットボトルのミルクティーが置いてある。おいしそう。
                    voice_character_id: null
                  - text: ラッキー　もらっとこう
                    voice_character_id: char_hero
                item_give:
                  - item_id: item_milktea
                    condition: null
                next_scene: scene_coderdojo_examine_area
              - id: scene_coderdojo_milktea_have
                messages:
                  - text: ミルクティーがある。もう持っているからいいか。
                    voice_character_id: char_hero
                next_scene: scene_coderdojo_examine_area
  - id: scene_slope_default
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/slope.mp3
    messages:
      - text: 団地への坂に来た。
        voice_character_id: null
  - id: scene_ch2_start
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_chapter
        value: 2
      - flag: flag_chapter1_cleared
        value: true
    messages:
      - text: 変な夢を見た。
        voice_character_id: char_hero
      - text: 薄暗い通路が続いていて、出口が見つからない夢だった。
        voice_character_id: null
      - text: 目が覚めると朝の七時。なんとなく一番街が気になって窓の外を見ると、あちらの空だけが重くよどんでいた。
        voice_character_id: null
      - text: スマホを開いたら、ユイからメッセージが届いていた。
        voice_character_id: null
      - text: 「ケン、一番街が変だよ。昨日からお店が急に閉まってて、冷たい空気がするの」
        voice_character_id: char_yui
      - text: 「地下からおかしな音もするって、噂になってる。気になって」
        voice_character_id: char_yui
      - text: なんか、気になる。一番街に行ってみよう。
        voice_character_id: char_hero
  - id: scene_ch2_ichibangai_post
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 一番街の入り口。あの夜以来、この通りにはまた少しだけ光が戻ってきた気がする。
        voice_character_id: null
  - id: scene_ichibangai_default
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_boss_challenged
                value: true
              - flag: flag_boss_return_yui_seen
                value: true
                negate: true
          next_scene: scene_ichibangai_boss_return
        - condition:
            and:
              - flag: flag_maze_defeated
                value: true
              - flag: flag_boss_challenged
                value: true
                negate: true
              - flag: flag_maze_return_yui_seen
                value: true
                negate: true
          next_scene: scene_ichibangai_maze_return
        - condition:
            flag: flag_boss_challenged
            value: true
          next_scene: scene_ichibangai_boss_ready
        - condition:
            and:
              - flag: flag_maze_defeated
                value: true
              - flag: flag_boss_challenged
                value: true
                negate: true
          next_scene: scene_ichibangai_maze_ready
        - condition: null
          next_scene: scene_ichibangai_first_visit
  - id: scene_ichibangai_first_visit
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
    messages:
      - text: 「ケン、来てくれた。あのゲートの奥だけ、空気が変なの」
        voice_character_id: char_yui
      - text: 「地下から変な音もするって……近づくなら気をつけて」
        voice_character_id: char_yui
    clickable_areas:
      - id: area_ch2_building_strange
        x: 284
        "y": 314
        width: 240
        height: 200
        label: ゲート
        next_scene: scene_ch2_building_approach
        condition: null
    talkable:
      - character_id: char_yui
        scene_id: scene_talk_ichibangai_first_yui
  - id: scene_ichibangai_maze_return
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_maze_return_yui_seen
        value: true
    characters:
      - character_id: char_yui
        position: left
        expression: sad
    messages:
      - text: 「ケン！　よかった……戻ってこられたんだね」
        voice_character_id: char_yui
      - text: 「さっき、急に倒れたから本当に怖かった」
        voice_character_id: char_yui
      - text: 「すぐ行かなくてもいいよ。少し息を整えよう」
        voice_character_id: char_yui
    clickable_areas:
      - id: area_ch2_gate_maze_retry
        x: 284
        "y": 314
        width: 240
        height: 200
        label: ゲート
        next_scene: scene_ch2_maze_gameover
        condition: null
    talkable:
      - character_id: char_yui
        scene_id: scene_talk_ichibangai_maze_yui
  - id: scene_ichibangai_boss_return
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_boss_return_yui_seen
        value: true
    characters:
      - character_id: char_yui
        position: left
        expression: sad
    messages:
      - text: 「ケン……戻ってきた。よかった、声が聞こえる」
        voice_character_id: char_yui
      - text: 「あいつ、強かったね。もう少しだったのに」
        voice_character_id: char_yui
      - text: 「今は一回、息をしよう。次に行くなら、それからでいい」
        voice_character_id: char_yui
    clickable_areas:
      - id: area_ch2_gate_boss_retry
        x: 284
        "y": 314
        width: 240
        height: 200
        label: ゲート
        next_scene: scene_ch2_boss_gameover
        condition: null
    talkable:
      - character_id: char_yui
        scene_id: scene_talk_ichibangai_boss_yui
  - id: scene_ichibangai_maze_ready
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
    messages: []
    clickable_areas:
      - id: area_ch2_gate_maze_retry_ready
        x: 284
        "y": 314
        width: 240
        height: 200
        label: ゲート
        next_scene: scene_ch2_maze_gameover
        condition: null
    talkable:
      - character_id: char_yui
        scene_id: scene_talk_ichibangai_maze_ready_yui
  - id: scene_ichibangai_boss_ready
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
    messages: []
    clickable_areas:
      - id: area_ch2_gate_boss_retry_ready
        x: 284
        "y": 314
        width: 240
        height: 200
        label: ゲート
        next_scene: scene_ch2_boss_gameover
        condition: null
    talkable:
      - character_id: char_yui
        scene_id: scene_talk_ichibangai_boss_ready_yui
  - id: scene_talk_ichibangai_first_yui
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
    messages:
      - text: 「いつもの一番街なら、もっと人の声がするのに」
        voice_character_id: char_yui
      - text: 「ねえケン、奥に行く前に、ちゃんと準備してね」
        voice_character_id: char_yui
    next_scene: null
  - id: scene_talk_ichibangai_maze_yui
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: sad
    messages:
      - text: 「本当に、戻ってきてくれてよかった」
        voice_character_id: char_yui
      - text: 「怖かったら、少し休んでもいいよ。ケンが決めて」
        voice_character_id: char_yui
    next_scene: null
  - id: scene_talk_ichibangai_boss_yui
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: sad
    messages:
      - text: 「あの瞬間、心臓が止まるかと思った」
        voice_character_id: char_yui
      - text: 「でも戻ってきた。だから、次はちゃんと立て直せる」
        voice_character_id: char_yui
    next_scene: null
  - id: scene_talk_ichibangai_maze_ready_yui
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
    messages:
      - text: 「準備できたら、ゲートを調べて」
        voice_character_id: char_yui
      - text: 「今度は焦らず行こう」
        voice_character_id: char_yui
    next_scene: null
  - id: scene_talk_ichibangai_boss_ready_yui
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
    messages:
      - text: 「あの奥に行くなら、ちゃんと準備してからね」
        voice_character_id: char_yui
      - text: 「次は、最後まで一緒に立っていよう」
        voice_character_id: char_yui
    next_scene: null
  - id: scene_ch2_building_approach
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
    messages:
      - text: 扉が半開きのまま。地下から冷たい空気が漏れてくる。
        voice_character_id: null
      - text: 「ケン……入るの？」
        voice_character_id: char_yui
      - text: うん。この不気味な空気の原因、確かめたい。
        voice_character_id: char_hero
      - text: 「わたしも行く。ひとりにしないで」
        voice_character_id: char_yui
      - text: 階段を降りると——通路が、異様に広がっていた。
        voice_character_id: null
      - text: 前に来たときとは全然違う。まるで迷路だ。
        voice_character_id: char_hero
    next_engine:
      id: maze_rpg
      transition: rift
      config:
        map: dungeon_02
        name: 一番街の異空間
        bgm: audio/bgm/dungeon.mp3
        battleBgm: audio/bgm/buttle.mp3
        theme:
          wallFront: "#584060"
          wallSide: "#2e1e38"
          ceilTop: "#02000c"
          ceilBottom: "#0a0618"
          floorTop: "#060410"
          floorBottom: "#030208"
          uiBg: "#04020e"
          uiAccent: "#c080ff"
          uiBorder: "#3a2060"
        events:
          E: scene_maze_event_01
        itemEffects:
          item_candy:
            healHp: full
          item_fushigi_candy:
            healHp: full
          item_drink:
            healHp: full
          item_milktea:
            healHp: full
          item_kinchu_hikari:
            attackEnemy: 999
      return_scene: scene_ch2_after_maze
      gameover_scene: scene_ch2_maze_gameover
      gameover_boss_scene: scene_ch2_boss_gameover
      gameover_landing_scene: scene_ichibangai_default
  - id: scene_ch2_maze_gameover
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_maze_defeated
        value: true
    characters:
      - character_id: char_yui
        position: right
        expression: sad
    messages:
      - text: ゲートに手をかけた瞬間、さっきの冷たい通路が脳裏によみがえった。
        voice_character_id: null
      - text: 「ケン……大丈夫？　顔色、まだ悪いよ」
        voice_character_id: char_yui
      - text: ……なんとか。あの迷路、思ったより手強い。
        voice_character_id: char_hero
      - text: 「怪我はない？　顔色悪いよ」
        voice_character_id: char_yui
      - text: 平気。……でも、まだあの奥が気になる。
        voice_character_id: char_hero
      - text: 「無理しないでよ。……でも、行くなら一緒に行く」
        voice_character_id: char_yui
    next_scene: scene_ch2_maze_retry
  - id: scene_ch2_maze_retry
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: right
        expression: normal
    messages:
      - text: うん。もう一度行こう。
        voice_character_id: char_hero
      - text: 「一緒に行く。今度は気をつけて」
        voice_character_id: char_yui
    next_engine:
      id: __return__
      transition: rift
  - id: scene_ch2_boss_gameover
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_boss_challenged
        value: true
    characters:
      - character_id: char_yui
        position: right
        expression: sad
    messages:
      - text: ゲートの奥を見た瞬間、あの強敵の気配が胸の奥を締めつけた。
        voice_character_id: null
      - text: 「ケン……もう少しだったよね。あと一歩で」
        voice_character_id: char_yui
      - text: ……あいつ、強かった。あんな奴が最後に待ってるなんて。
        voice_character_id: char_hero
      - text: 「でも、あそこまで行けたんだよ。入り口から全部通り抜けて——」
        voice_character_id: char_yui
      - text: ……もう一回、行ける。さっきのところまでは分かってるから。
        voice_character_id: char_hero
      - text: 「うん。今度こそ一緒に倒そう」
        voice_character_id: char_yui
    next_scene: scene_ch2_boss_maze_retry
  - id: scene_ch2_boss_maze_retry
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: right
        expression: normal
    messages:
      - text: ——また、あの通路の前に立った。
        voice_character_id: null
      - text: 「準備はいい？」
        voice_character_id: char_yui
      - text: うん。今度は負けない。
        voice_character_id: char_hero
    next_engine:
      id: __return__
      transition: rift
  - id: scene_maze_event_01
    location_id: loc_ichibangai
    background: backgrounds/inner_ichibangai_dark.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
    messages:
      - text: ——突然、視界が歪んだ。
        voice_character_id: null
      - text: そこには、見覚えのある顔があった。
        voice_character_id: null
      - text: 「……田村のおばちゃん？　なんでここに」
        voice_character_id: char_hero
      - text: 「あら、ケンちゃん。こんなとこまで来てがんばってるんやね」
        voice_character_id: char_obachan
      - text: 「ほら、あめちゃん。お腹すいたやろ」
        voice_character_id: char_obachan
      - text: ——気づくと、おばちゃんの姿は消えていた。手のひらの中に、アメが一粒残っていた。
        voice_character_id: null
    item_give:
      - item_id: item_fushigi_candy
        condition:
          has_item: item_fushigi_candy
          negate: true
    next_engine:
      id: __return__
      transition: rift
  - id: scene_ch2_after_maze
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: right
        expression: happy
    messages:
      - text: 出口を抜けると、外の空気がまるで変わっていた。
        voice_character_id: null
      - text: さっきまでの重さが消えて、秋の午後みたいな澄んだ風が一番街に流れていた。
        voice_character_id: null
      - text: 「ケン！　無事だった？　なんか急に——空気が変わったんだけど」
        voice_character_id: char_yui
      - text: うん。なんとか出てこられた。
        voice_character_id: char_hero
      - text: 「あの迷路、何だったんだろ。でも……なんか一番街が戻ってきた気がする」
        voice_character_id: char_yui
      - text: ぼくも、そう思う。
        voice_character_id: char_hero
    next_scene: scene_ch2_drunk_uncle
  - id: scene_ch2_drunk_uncle
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: right
        expression: normal
      - character_id: char_oyaji
        position: left
        expression: normal
    messages:
      - text: そのとき、一番街の入り口の柱にもたれたよれよれのジャンパーのおじさんが目に入った。
        voice_character_id: null
      - text: 「……いやあ、すまんかったのう。わし、飲みすぎてしもうたんじゃ」
        voice_character_id: char_oyaji
      - text: 「え……このおじさん、誰？」
        voice_character_id: char_yui
      - text: 「なんかこう、グビグビッとやったら……商店街がおかしくなってしもうて。ほんまにすまんかった」
        voice_character_id: char_oyaji
      - text: ……もしかして、この人が原因？
        voice_character_id: char_hero
      - text: 「いや、さすがにそれはないでしょ」
        voice_character_id: char_yui
      - text: 「次からはちゃんと家で飲みます。迷惑かけてすまんかったのう……」
        voice_character_id: char_oyaji
      - text: おじさんはふらふらと商店街の奥へ消えていった。
        voice_character_id: null
      - text: ケンとユイは顔を見合わせて、それから同時に笑った。
        voice_character_id: null
    next_scene: scene_ch2_ending_credits
  - id: scene_ch2_ending_credits
    location_id: loc_ichibangai
    bgm: audio/bgm/ending.mp3
    ending_title: 第2章　一番街の異空間
    messages: []
    game_end: true
    flags_set:
      - flag: flag_ch2_cleared
        value: true
    cg_sequence:
      - src: cg/happy_dojo.jpg
        position: center
      - src: cg/obachan_ghost.jpg
        position: center
      - src: cg/get_superitem.jpg
        position: center
      - src: cg/buttle_ichibangai.jpg
        position: center
  - id: scene_use_candy
    overlay_image: cg/candy_happy.jpg
    item_remove:
      - item_candy
    messages:
      - text: アメをなめた。
        voice_character_id: null
      - text: 甘くておいしい。
        voice_character_id: null
      - text: ……なんだか、すごく幸せな気持ちになった。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_use_juice
    overlay_image: cg/happy_juice.jpg
    item_remove:
      - item_drink
    messages:
      - text: ジュースを飲んだ。
        voice_character_id: null
      - text: あっさりとしていて、とてもおいしい。
        voice_character_id: null
      - text: ……なんだか、すごく幸せな気持ちになった。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_use_milktea
    overlay_image: cg/happy_juice.jpg
    item_remove:
      - item_milktea
    messages:
      - text: ミルクティーを飲んだ。
        voice_character_id: null
      - text: やさしい甘さで、ほっとする味がした。
        voice_character_id: null
      - text: ……少し、気持ちが落ち着いた。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_use_fushigi_candy
    overlay_image: cg/candy_happy.jpg
    item_remove:
      - item_fushigi_candy
    messages:
      - text: 不思議なアメをなめた。
        voice_character_id: null
      - text: ひんやりしているのに、甘くてやさしい味がした。
        voice_character_id: null
      - text: ……体の中から、力が戻ってくる気がした。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_use_kinchu_hikari
    messages:
      - text: 禁酒の光を手に持ってみた。
        voice_character_id: null
      - text: かすかな輝きが、掌に温かく広がる。
        voice_character_id: null
      - text: ……これは、戦いのときに使おう。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_park_default
    location_id: loc_park
    background: backgrounds/danchimae.jpg
    messages:
      - text: 公園に来た。今日はここでやることはなさそうだ。
        voice_character_id: null

  - id: scene_arcade_default
    location_id: loc_arcade
    background: backgrounds/intersection.jpg
    messages:
      - text: アーケード街は、今日はまだ静かだ。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_default
    location_id: loc_museum
    background: backgrounds/museum.jpg
    messages:
      - text: 団地のミュージアムは、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_plum_park_default
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    messages:
      - text: 梅の木公園は、今日は静まり返っている。
        voice_character_id: null
    next_scene: null

  - id: scene_station_end_default
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    messages:
      - text: 駅の端は、今日は特に変わったことはなさそうだ。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_core_default
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    messages:
      - text: ミュージアムの中心部は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_history_room_default
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 「赤羽の歴史」の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_portrait_room_default
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 「人々の肖像」の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_storage_room_default
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 収蔵庫は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_deep_core_default
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    messages:
      - text: ミュージアムの奥は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_yui_room_default
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 記憶の展示室は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_oyaji_room_default
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 古い道具の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null
`,l=`scenes:
  - id: scene_ch3_start
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_chapter
        value: 3
      - flag: flag_chapter1_cleared
        value: true
      - flag: flag_ch2_cleared
        value: true
    messages:
      - text: 第3章　アーケード街の死闘
        voice_character_id: null
      - text: 一番街での騒動が落ち着いてから、数日が経った。
        voice_character_id: null
      - text: 団地の広場に出ると、田村のおばあさんがベンチに座ってため息をついていた。
        voice_character_id: null
    next_scene: scene_ch3_obachan_intro
  - id: scene_danchi_morning
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch3_second_ticket_got
                value: true
              - flag: flag_ch3_second_ticket_given_to_obachan
                value: false
          next_scene: scene_ch3_danchi_go_arcade_with_second_ticket
        - condition:
            and:
              - flag: flag_ch3_ticket_given_to_bad_kids
                value: true
              - flag: flag_ch3_second_ticket_got
                value: false
          next_scene: scene_ch3_danchi_go_museum_again
        - condition:
            and:
              - flag: flag_ch3_got_ticket
                value: true
              - flag: flag_ch3_ticket_given
                value: false
          next_scene: scene_ch3_ready_to_give_ticket
        - condition:
            and:
              - flag: flag_ch3_helping_obachan
                value: true
              - flag: flag_ch3_museum_unlocked
                value: true
              - flag: flag_ch3_got_ticket
                value: false
          next_scene: scene_ch3_danchi_go_museum
        - condition:
            flag: flag_ch3_helping_obachan
            value: true
          next_scene: scene_ch3_danchi_searching
        - condition: null
          next_scene: scene_ch3_danchi_idle
  - id: scene_station_default
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch3_second_ticket_got
                value: true
              - flag: flag_ch3_second_ticket_given_to_obachan
                value: false
          next_scene: scene_ch3_station_go_arcade_with_second_ticket
        - condition:
            and:
              - flag: flag_ch3_ticket_given_to_bad_kids
                value: true
              - flag: flag_ch3_second_ticket_got
                value: false
          next_scene: scene_ch3_station_go_museum_again
        - condition:
            and:
              - flag: flag_ch3_helping_obachan
                value: true
              - flag: flag_ch3_museum_unlocked
                value: false
          next_scene: scene_ch3_station_college
        - condition: null
          next_scene: scene_ch3_station_idle
  - id: scene_museum_default
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch3_ticket_given_to_bad_kids
                value: true
              - flag: flag_ch3_second_ticket_got
                value: false
          next_scene: scene_ch3_museum_second_visit
        - condition:
            flag: flag_ch3_second_ticket_got
            value: true
          next_scene: scene_ch3_museum_after_ticket
        - condition:
            flag: flag_ch3_got_ticket
            value: true
          next_scene: scene_ch3_museum_after_ticket
        - condition: null
          next_scene: scene_ch3_museum_receptionist
  - id: scene_coderdojo_default
    location_id: loc_coderdojo
    background: backgrounds/museum.jpg
    bgm: audio/bgm/coderdojo.mp3
    messages:
      - text: CoderDojo赤羽の会場は静かだ。今日は駅前へ戻ったほうがよさそうだ。
        voice_character_id: null
  - id: scene_ichibangai_default
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 一番街の入口に来た。今は別の場所が気にかかる。
        voice_character_id: null
  - id: scene_slope_default
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/slope.mp3
    messages:
      - text: 団地への坂に来た。駅前のざわめきが、ここまで届いている気がする。
        voice_character_id: null
  - id: scene_park_default
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch3_second_ticket_got
                value: true
              - flag: flag_ch3_second_ticket_given_to_obachan
                value: false
          next_scene: scene_ch3_park_go_arcade_with_second_ticket
        - condition:
            and:
              - flag: flag_ch3_ticket_given_to_bad_kids
                value: true
              - flag: flag_ch3_second_ticket_got
                value: false
          next_scene: scene_ch3_park_after_ticket_given
        - condition:
            flag: flag_ch3_ticket_recovered
            value: true
          next_scene: scene_ch3_park_idle
        - condition:
            flag: flag_ch3_ticket_stolen
            value: true
          next_scene: scene_ch3_park_after_ticket_stolen
        - condition: null
          next_scene: scene_ch3_park_idle
  - id: scene_ch3_park_idle
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 公園に来た。子どもたちの声が遠くで弾んでいる。
        voice_character_id: null
  - id: scene_ch3_park_after_ticket_given
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: アメ好きっ子の姿はもうない。公園には、さっきまでの足音だけが残っている気がした。
        voice_character_id: null
      - text: おばちゃんを大会に出すために、もう一枚のチケットを探そう。ミュージアムでもう一度相談できるかもしれない。
        voice_character_id: null
  - id: scene_ch3_park_go_arcade_with_second_ticket
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 公園はすっかり落ち着いている。手の中には、もう一枚のチケットがある。
        voice_character_id: null
      - text: おばちゃんが待つアーケード街へ戻ろう。
        voice_character_id: null
  - id: scene_ch3_park_after_ticket_stolen
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_candy_kid
        position: right
        expression: talking
    messages:
      - text: 公園に駆け込むと、遊具のそばでさっきの子がチケットをひらひらさせていた。
        voice_character_id: null
      - text: 「げっ、追ってきた！　逃げろ！」
        voice_character_id: char_candy_kid
      - text: アメ好きっ子はチケットを握ったまま、公園の奥へ走り出した。
        voice_character_id: null
    branches:
      type: choice
      choices:
        - label: 追いかける
          condition: null
          next_scene: scene_ch3_park_chase_start
  - id: scene_ch3_park_chase_start
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: アメ好きっ子との距離が少しずつ縮まっていく。犬と鳥にぶつからないように追いかけよう。
        voice_character_id: null
    next_engine:
      id: runner_action
      transition: speedline
      config:
        stageId: park_chase_bad_kids
        mode: chase
        name: チケットを取り返せ！
        durationMs: 25000
        bgm: audio/bgm/rase.mp3
        bgmVolume: 0.24
        backgroundImage: runner/loop_park.jpg
        backgroundLoopWidth: 1352
        playerImage: runner/hero.png
        playerWidth: 74
        playerHeight: 104
        opponentImage: runner/ame.png
        opponentWidth: 58
        opponentHeight: 84
        theme:
          sky: "#182033"
          ground: "#29302e"
          accent: "#ff8f70"
      return_scene: scene_ch3_after_park_chase
  - id: scene_ch3_after_park_chase
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: runner_action_result_park_chase_bad_kids
            value: win
          next_scene: scene_ch3_park_chase_win
        - condition: null
          next_scene: scene_ch3_park_chase_retry
  - id: scene_ch3_park_chase_win
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_candy_kid
        position: right
        expression: normal
    flags_set:
      - flag: flag_ch3_ticket_recovered
        value: true
    messages:
      - text: ケンはアメ好きっ子に追いつき、くしゃくしゃになったチケットを取り返した。
        voice_character_id: null
      - text: 「ご、ごめんなさい！　もう取りません！」
        voice_character_id: char_candy_kid
      - text: アメ好きっ子はうつむきながら、アメちゃんが大好きで、本当はアメちゃんチャレンジに参加したかったのだと話した。
        voice_character_id: char_candy_kid
      - text: 「……そないにアメちゃんが好きやったんか」
        voice_character_id: char_obachan
    next_scene: scene_ch3_obachan_gives_ticket_to_bad_kids
  - id: scene_ch3_obachan_gives_ticket_to_bad_kids
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    overlay_image: cg/give_ticket.jpg
    characters:
      - character_id: char_obachan
        position: right
        expression: talking
    flags_set:
      - flag: flag_ch3_ticket_given_to_bad_kids
        value: true
    messages:
      - text: 「アメちゃんを愛する子は、ほんまはええ子や」
        voice_character_id: char_obachan
      - text: おばちゃんは取り返したチケットを、アメ好きっ子の手にそっと戻した。
        voice_character_id: null
      - text: 「ちゃんと並んで、みんなで楽しむんやで」
        voice_character_id: char_obachan
      - text: アメ好きっ子は何度も頭を下げて、公園の出口へ走っていった。
        voice_character_id: null
      - text: 「ケンちゃん、あの子には楽しんでもらお。うちらは、もう一枚ないかミュージアムで相談してみよか」
        voice_character_id: char_obachan
  - id: scene_ch3_park_chase_retry
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_candy_kid
        position: right
        expression: normal
    messages:
      - text: アメ好きっ子は公園の奥でこちらを見ている。まだチケットは取り返せていない。
        voice_character_id: null
      - text: 犬と鳥をよけながら、もう一度追いかけよう。
        voice_character_id: null
    branches:
      type: choice
      choices:
        - label: もう一度追いかける
          condition: null
          next_scene: scene_ch3_park_chase_retry_start
        - label: いったん立ち去る
          condition: null
          next_scene: scene_ch3_park_cannot_leave
  - id: scene_ch3_park_cannot_leave
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_candy_kid
        position: right
        expression: normal
    messages:
      - text: 公園を出ようとした瞬間、おばちゃんのチケットを握ったアメ好きっ子が目に入った。
        voice_character_id: null
      - text: このまま帰るわけにはいかない。チケットを取り返そう。
        voice_character_id: null
    branches:
      type: choice
      choices:
        - label: もう一度追いかける
          condition: null
          next_scene: scene_ch3_park_chase_retry_start
  - id: scene_ch3_park_chase_retry_start
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: アメ好きっ子の息も少し上がっている。今度はさっきより追いつきやすそうだ。
        voice_character_id: null
    next_engine:
      id: runner_action
      transition: speedline
      config:
        stageId: park_chase_bad_kids
        mode: chase
        name: チケットを取り返せ！
        durationMs: 30000
        bgm: audio/bgm/rase.mp3
        bgmVolume: 0.24
        chaseStartDistance: 90
        chaseCatchRate: 0.0054
        chaseHitDistancePenalty: 12
        backgroundImage: runner/loop_park.jpg
        backgroundLoopWidth: 1352
        playerImage: runner/hero.png
        playerWidth: 74
        playerHeight: 104
        opponentImage: runner/ame.png
        opponentWidth: 58
        opponentHeight: 84
        theme:
          sky: "#182033"
          ground: "#29302e"
          accent: "#ff8f70"
      return_scene: scene_ch3_after_park_chase
  - id: scene_ch3_obachan_intro
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: 「おばちゃん、どうしたん？　元気なさそうやで」
        voice_character_id: char_hero
      - text: 「あらケンちゃん。実はな……アーケード街でアメちゃんゲットのイベントがあるんやけど」
        voice_character_id: char_obachan
      - text: 「行きたかったんやけど、出遅れてしもうてな。チケット、もう取れへんかったんよ」
        voice_character_id: char_obachan
      - text: 「そのイベント、走りながらアメちゃんを拾うやつやんな。おばちゃんが参加したら絶対楽しいのに」
        voice_character_id: char_hero
      - text: 「ほんまやろ。でもチケットがないとなあ……」
        voice_character_id: char_obachan
      - text: おばちゃんのためにチケットを探してみよう。まずは駅前で情報を集めよう。
        voice_character_id: null
    flags_set:
      - flag: flag_ch3_helping_obachan
        value: true
  - id: scene_ch3_danchi_searching
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    messages:
      - text: おばちゃんのためにチケットを探している。まずは駅前で話を聞いてみよう。
        voice_character_id: null
  - id: scene_ch3_danchi_go_museum
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    messages:
      - text: ミュージアムの受付がチケットを持っているらしい。団地のミュージアムへ行ってみよう。
        voice_character_id: null
  - id: scene_ch3_danchi_go_museum_again
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    messages:
      - text: 最初のチケットはアメ好きっ子に譲った。おばちゃんを大会に出すため、もう一度ミュージアムへ相談しに行こう。
        voice_character_id: null
  - id: scene_ch3_danchi_go_arcade_with_second_ticket
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    messages:
      - text: もう一枚のチケットは手に入った。おばちゃんが待つアーケード街へ急ごう。
        voice_character_id: null
  - id: scene_ch3_danchi_idle
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    messages:
      - text: 団地に戻ってきた。
        voice_character_id: null
  - id: scene_ch3_ready_to_give_ticket
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: おばちゃんがまだベンチで待っていた。ポケットの中のチケットが気になった。
        voice_character_id: null
      - text: 「おばちゃん、これ。チケット、見つけてきたで」
        voice_character_id: char_hero
    next_scene: scene_ch3_give_ticket_to_obachan
  - id: scene_ch3_give_ticket_to_obachan
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: talking
    item_remove:
      - item_event_ticket
    flags_set:
      - flag: flag_ch3_ticket_given
        value: true
    messages:
      - text: 「え……！　ケンちゃん、ほんまに……？」
        voice_character_id: char_obachan
      - text: 「うん。ミュージアムの受付さんから直接もらってきた」
        voice_character_id: char_hero
      - text: 「もう、ケンちゃん……ありがとうな。ほな、一緒にアーケードへ行こか！」
        voice_character_id: char_obachan
      - text: おばちゃんの目に光が戻った気がした。
        voice_character_id: null
    next_scene: scene_ch3_goto_arcade
  - id: scene_ch3_station_idle
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 赤羽駅前にいる。おばちゃんのことが気になる。
        voice_character_id: null
  - id: scene_ch3_station_go_museum_again
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 駅前のざわめきの向こうに、団地のミュージアムへ続く道が見える。
        voice_character_id: null
      - text: おばちゃんのために、もう一枚のチケットを頼みに行こう。
        voice_character_id: null
  - id: scene_ch3_station_go_arcade_with_second_ticket
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 駅前の人波を抜けると、アーケード街の垂れ幕が見えた。
        voice_character_id: null
      - text: もう一枚のチケットを、おばちゃんに早く渡そう。
        voice_character_id: null
  - id: scene_ch3_station_college
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_college_student
        position: right
        expression: normal
    messages:
      - text: 駅前に出ると、見たことがある大学生が立ち止まってスマホをいじっていた。
        voice_character_id: null
    talkable:
      - character_id: char_college_student
        scene_id: scene_ch3_talk_college_student
  - id: scene_ch3_talk_college_student
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_college_student
        position: right
        expression: normal
    messages:
      - text: 大学生が顔を上げてこちらを見た。
        voice_character_id: null
      - text: 「あ、こんにちは。なんか困ってます？　この辺ならちょっと詳しいですよ」
        voice_character_id: char_college_student
    next_scene: scene_ch3_college_menu
    child_scenes:
      - id: scene_ch3_college_menu
        messages: []
        branches:
          type: choice
          choices:
            - label: アメちゃんゲットのチケットについて聞く
              next_scene: scene_ch3_college_ticket
            - label: グミのことを聞く
              next_scene: scene_ch3_college_gumi
            - label: ありがとう、もう大丈夫
              next_scene: null
      - id: scene_ch3_college_ticket
        messages:
          - text: 「あ、もしかしてアメちゃんゲットのチケット探してます？」
            voice_character_id: char_college_student
          - text: 「そう！　知ってる？」
            voice_character_id: char_hero
          - text: 「噂ですけど、団地の中のミュージアム、あそこの受付さんが余分に持ってるらしいですよ」
            voice_character_id: char_college_student
          - text: 「ありがとう！　行ってみる！」
            voice_character_id: char_hero
          - text: ミュージアムの受付の人がチケットを持っているらしい。行ってみよう。
            voice_character_id: null
        flags_set:
          - flag: flag_ch3_museum_unlocked
            value: true
        next_scene: scene_ch3_college_menu
      - id: scene_ch3_college_gumi
        messages:
          - text: 「グミ？　ああ、最近ここの駅ビルのコンビニに限定グミが入ってるみたいですよ」
            voice_character_id: char_college_student
          - text: 「限定？　どんなやつ？」
            voice_character_id: char_hero
          - text: 「ソーダ味の激酸っぱいやつです。SNSで話題になってて、すぐ売り切れるらしいんですよね」
            voice_character_id: char_college_student
          - text: 「へえ……機会があったら探してみよ」
            voice_character_id: char_hero
        next_scene: scene_ch3_college_menu
  - id: scene_ch3_museum_receptionist
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: right
        expression: normal
    messages:
      - text: 受付にいたのは、名札を少し斜めにつけた大学生のバイトだった。
        voice_character_id: null
      - text: カウンターの上には、アメちゃんゲット大会のチケットが一枚だけ置かれている。
        voice_character_id: null
    talkable:
      - character_id: char_museum_part_timer
        scene_id: scene_ch3_talk_museum_staff
  - id: scene_ch3_talk_museum_staff
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: right
        expression: talking
    messages:
      - text: 「あのう、チケットをお持ちって聞いたんですが……」
        voice_character_id: char_hero
      - text: 「あっ、はい！ただいまバイトの私しかいなくって、、いいのかな、、　えっと、あります！　……あれ、どこに置いたっけ……あ、ここでした！」
        voice_character_id: char_museum_part_timer
      - text: 「でも受付さんから、渡す前に神経衰弱で確認するようにって言われてて……たぶん、そういう決まりです！」
        voice_character_id: char_museum_part_timer
      - text: 「神経衰弱なら、やってみます」
        voice_character_id: char_hero
    next_engine:
      id: memory_game
      transition: cardflip
      config:
        stageId: museum_part_timer_challenge
        bgm: audio/bgm/mistery.mp3
        mode: duel
        pairs: 5
        opponentSkill: weak
        title: チケット争奪 神経衰弱
        playerCharacterId: char_hero
        opponentCharacterId: char_museum_part_timer
        opponentDialogue:
          - えっと、さっき見た気がします！
          - たぶんこっち……かな？
          - メモしたいけど、神経衰弱だからだめですよね
        opponentMatchDialogue:
          - あ、そろいました！
          - やった、当たりです！
        opponentMissDialogue:
          - あれ、違いました……
          - すみません、完全に勘でした
          - えへへ、まちがえちゃいました
        playerMatchDialogue:
          - やった！
          - そろった！
        playerMissDialogue:
          - あれ……
          - ちがった
      return_scene: scene_ch3_museum_game_result
  - id: scene_ch3_museum_game_result
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: memory_game_result_museum_part_timer_challenge
            value: win
          next_scene: scene_ch3_museum_win
        - condition: null
          next_scene: scene_ch3_museum_lose
  - id: scene_ch3_museum_win
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: right
        expression: talking
    item_give:
      - item_id: item_event_ticket
        condition: null
    flags_set:
      - flag: flag_ch3_got_ticket
        value: true
    messages:
      - text: 「わあ、強いですね！　私、途中からどれがどれだか分からなくなってました」
        voice_character_id: char_museum_part_timer
      - text: 「あの……チケット、お約束なので……」
        voice_character_id: char_hero
      - text: 「はい、どうぞ！　えっと……なくさないように気をつけてくださいね。私もよくなくすので！」
        voice_character_id: char_museum_part_timer
      - text: 「ありがとうございます！」
        voice_character_id: char_hero
      - text: チケットを手に入れた。おばちゃんのいる団地へ戻ろう。
        voice_character_id: null
  - id: scene_ch3_museum_lose
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: right
        expression: normal
    messages:
      - text: 「あ、私、勝っちゃいました……？　えっと、これで合ってますよね？」
        voice_character_id: char_museum_part_timer
      - text: 「すみません、チケットは勝った人に渡す決まりみたいで……もう一回やります？」
        voice_character_id: char_museum_part_timer
      - text: 「……もう一回、絶対勝ちます！」
        voice_character_id: char_hero
    talkable:
      - character_id: char_museum_part_timer
        scene_id: scene_ch3_talk_museum_staff
  - id: scene_ch3_museum_after_ticket
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages:
      - text: もうチケットはもらった。おばちゃんのところへ戻ろう。
        voice_character_id: null
  - id: scene_ch3_museum_second_visit
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: left
        expression: normal
      - character_id: char_museum_staff
        position: right
        expression: talking
    messages:
      - text: ミュージアムへ戻ると、受付には女子大生バイトと美術館員の二人が並んでいた。
        voice_character_id: null
      - text: 「あっ、さっきのチケットの人！　チケット、見つかりましたか？」
        voice_character_id: char_museum_part_timer
      - text: 「見つかったんですけど……アメちゃんが大好きな子に、おばちゃんが譲ったんです」
        voice_character_id: char_hero
      - text: 「話は分かった。アメちゃんを愛する子に譲ったのなら、悪い使い道ではない」
        voice_character_id: char_museum_staff
      - text: 「でも、おばちゃんも大会に出したいんです。もう一枚、お願いできませんか」
        voice_character_id: char_hero
      - text: 「ならば再び勝負だ。今度はわたしが相手をしよう。勝てば、もう一枚を渡す」
        voice_character_id: char_museum_staff
    next_scene: scene_ch3_talk_museum_staff_second
  - id: scene_ch3_talk_museum_staff_second
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: left
        expression: normal
      - character_id: char_museum_staff
        position: right
        expression: talking
    messages:
      - text: 「神経衰弱は記憶の美術館。開かれた札は、すべて心の額縁に飾られる」
        voice_character_id: char_museum_staff
      - text: 「えっと、つまり……さっきより本気ってことです」
        voice_character_id: char_museum_part_timer
      - text: 「負けません。おばちゃんを大会に出すんです」
        voice_character_id: char_hero
    next_engine:
      id: memory_game
      transition: cardflip
      config:
        stageId: museum_staff_second_challenge
        bgm: audio/bgm/mistery.mp3
        mode: duel
        pairs: 6
        title: 再戦 チケット争奪 神経衰弱
        playerCharacterId: char_hero
        opponentCharacterId: char_museum_staff
        opponentDialogue:
          - この札の気配……覚えたぞ
          - 記憶の扉は開かれている
          - 迷いはない。次はここだ
        opponentMatchDialogue:
          - ふっ、額縁がそろった
          - 見えたぞ、対の記憶が
        opponentMissDialogue:
          - くっ、幻の展示だったか
          - 記憶の回廊が揺らいだ……
        playerMatchDialogue:
          - やった！
          - そろった！
        playerMissDialogue:
          - あれ……
          - ちがった
      return_scene: scene_ch3_museum_second_game_result
  - id: scene_ch3_museum_second_game_result
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: memory_game_result_museum_staff_second_challenge
            value: win
          next_scene: scene_ch3_museum_second_win
        - condition: null
          next_scene: scene_ch3_museum_second_lose
  - id: scene_ch3_museum_second_win
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: left
        expression: normal
      - character_id: char_museum_staff
        position: right
        expression: talking
    item_give:
      - item_id: item_event_ticket
        condition: null
    flags_set:
      - flag: flag_ch3_second_ticket_got
        value: true
    messages:
      - text: 「見事だ。チケットを譲った心も、記憶力も、どちらも本物だった」
        voice_character_id: char_museum_staff
      - text: 「約束だ。もう一枚、正式に渡そう」
        voice_character_id: char_museum_staff
      - text: 「今度はなくさないでくださいね。あ、私が言うのも変ですけど！」
        voice_character_id: char_museum_part_timer
      - text: 「ありがとうございます。今度こそ、おばちゃんを大会に出します」
        voice_character_id: char_hero
      - text: 再びチケットを手に入れた。アーケード街へ戻ろう。
        voice_character_id: null
  - id: scene_ch3_museum_second_lose
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: left
        expression: normal
      - character_id: char_museum_staff
        position: right
        expression: talking
    messages:
      - text: 「まだ記憶の額縁は完成していないようだな」
        voice_character_id: char_museum_staff
      - text: 「でも、もう少しでした！　きっと次はいけます」
        voice_character_id: char_museum_part_timer
      - text: 「もう一度お願いします。絶対に取りに来ます」
        voice_character_id: char_hero
    talkable:
      - character_id: char_museum_staff
        scene_id: scene_ch3_talk_museum_staff_second
  - id: scene_ch3_goto_arcade
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: talking
    messages:
      - text: アーケード街の入り口に「アメちゃんゲット大会」の垂れ幕が下がっていた。
        voice_character_id: null
      - text: 「おばちゃん、ここやな」
        voice_character_id: char_hero
      - text: 「ケンちゃんのおかげや。ほな、受付前に行こか」
        voice_character_id: char_obachan
    talkable:
      - character_id: char_obachan
        scene_id: scene_ch3_talk_obachan_ticket_stolen
        condition:
          flag: flag_ch3_ticket_stolen
          value: false
  - id: scene_ch3_talk_obachan_ticket_stolen
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: talking
    flags_set:
      - flag: flag_ch3_ticket_stolen
        value: true
    messages:
      - text: 「ケンちゃん、準備はええ？　チケット、受付に見せよか」
        voice_character_id: char_obachan
      - text: おばちゃんが巾着からチケットを出した、その瞬間だった。
        voice_character_id: null
      - text: 「へへっ、アメちゃん大会のチケットや！　もーらい！」
        voice_character_id: char_candy_kid
        characters:
          - character_id: char_candy_kid
            position: left
            expression: talking
          - character_id: char_obachan
            position: right
            expression: talking
      - text: アメ好きっ子が横から飛び出し、チケットを奪って走り去った。
        voice_character_id: null
        characters:
          - character_id: char_candy_kid
            position: left
            expression: talking
          - character_id: char_obachan
            position: right
            expression: talking
      - text: 「ちょ、ちょっと！　それ、おばちゃんの大事なチケットやで！」
        voice_character_id: char_obachan
        characters:
          - character_id: char_obachan
            position: right
            expression: talking
      - text: 通りの人が「あの子、公園のほうへ逃げたぞ！」と叫んだ。
        voice_character_id: null
      - text: アメ好きっ子は公園に向かったようだ。チケットを取り返さないと、イベントには出られない。
        voice_character_id: null
    next_scene: scene_ch3_arcade_ticket_stolen_hint
  - id: scene_ch3_arcade_ticket_stolen_hint
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: おばちゃんはアーケード街の入口で、心配そうに公園の方角を見ている。
        voice_character_id: null
      - text: まずは公園へ向かい、アメ好きっ子からチケットを取り返そう。
        voice_character_id: null
  - id: scene_ch3_arcade_event_start
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: 「では参加者の方、スタートラインへどうぞ！」
        voice_character_id: null
      - text: 「ケンちゃん、見ててね！」
        voice_character_id: char_obachan
    next_engine:
      id: runner_action
      transition: speedline
      config:
        stageId: arcade_deathmatch
        name: アメちゃんゲット大会
        durationMs: 30000
        bgm: audio/bgm/rase.mp3
        bgmVolume: 0.24
        objectSpeedMultiplier: 1.25
        backgroundImage: runner/arcade_loop.jpg
        backgroundLoopWidth: 1352
        playerImage: runner/obachan.png
        playerWidth: 72
        playerHeight: 104
        theme:
          sky: "#151827"
          ground: "#2a2d32"
          accent: "#f2d16b"
      return_scene: scene_ch3_after_runner

  - id: scene_museum_deep_core_default
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    messages:
      - text: ミュージアムの奥は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_yui_room_default
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 記憶の展示室は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_oyaji_room_default
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 古い道具の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_plum_park_default
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    messages:
      - text: 梅の木公園は、今日は静まり返っている。
        voice_character_id: null
    next_scene: null

  - id: scene_station_end_default
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    messages:
      - text: 駅の端は、今日は特に変わったことはなさそうだ。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_core_default
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    messages:
      - text: ミュージアムの中心部は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_history_room_default
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 「赤羽の歴史」の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_portrait_room_default
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 「人々の肖像」の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_storage_room_default
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 収蔵庫は、今日は閉じられている。
        voice_character_id: null
    next_scene: null
  - id: scene_ch3_after_runner
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: runner_action_score_arcade_deathmatch
            min: 7
          next_scene: scene_ch3_after_runner_many_candy
        - condition:
            flag: runner_action_score_arcade_deathmatch
            min: 4
          next_scene: scene_ch3_after_runner_some_candy
        - condition: null
          next_scene: scene_ch3_after_runner_few_candy
  - id: scene_ch3_after_runner_many_candy
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/ending.mp3
    ending_title: 第3章　アーケード街の死闘
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: アーケードの端まで走り抜けると、おばちゃんが両手いっぱいのアメちゃんを抱えて戻ってきた。
        voice_character_id: null
      - text: 「ケンちゃん、見てた？　まだまだ走れるやろ」
        voice_character_id: char_obachan
      - text: おばちゃんの息は上がっていたけれど、顔は子どもみたいに輝いていた。
        voice_character_id: null
      - text: 「すごいよ、おばちゃん。会場でいちばん楽しそうに走ってた」
        voice_character_id: char_hero
      - text: 「アメちゃんのためなら、足も心も軽うなるんよ」
        voice_character_id: char_obachan
      - text: 拍手の中、おばちゃんは胸を張って笑った。
        voice_character_id: null
      - text: 第3章　アーケード街の死闘　完
        voice_character_id: null
    game_end: true
    flags_set:
      - flag: flag_ch3_cleared
        value: true
    cg_sequence:
      - src: cg/candy_happy.jpg
        position: center
      - src: cg/play_card.jpg
        position: center
      - src: cg/run_park.jpg
        position: center
      - src: cg/mirai.jpg
        position: center
  - id: scene_ch3_after_runner_some_candy
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/ending.mp3
    ending_title: 第3章　アーケード街の死闘
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: ゴールの笛が鳴ると、おばちゃんはアメちゃんを大事そうに握りしめて戻ってきた。
        voice_character_id: null
      - text: 「思ったより、ええ運動になったわあ」
        voice_character_id: char_obachan
      - text: 「途中で犬も鳥も来たのに、最後まで走りきったやん。おばちゃん、かっこよかったで」
        voice_character_id: char_hero
      - text: 「ふふ、ケンちゃんにそう言われたら、今日はもう優勝やね」
        voice_character_id: char_obachan
      - text: 取れた数は多くなくても、おばちゃんの健闘に会場からあたたかい拍手が起きた。
        voice_character_id: null
      - text: 第3章　アーケード街の死闘　完
        voice_character_id: null
    game_end: true
    flags_set:
      - flag: flag_ch3_cleared
        value: true
    cg_sequence:
      - src: cg/candy_happy.jpg
        position: center
      - src: cg/play_card.jpg
        position: center
      - src: cg/run_park.jpg
        position: center
      - src: cg/mirai.jpg
        position: center
  - id: scene_ch3_after_runner_few_candy
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: ゴールまであと少しのところで、おばちゃんは息を切らして立ち止まった。
        voice_character_id: null
      - text: 「あかん、アメちゃんを追いすぎて、足がもつれてしもうた」
        voice_character_id: char_obachan
      - text: 「でも、今の走り出しはよかったよ。もう一回やったら、きっといける」
        voice_character_id: char_hero
      - text: 「せやな。アメちゃんに背中を押してもらって、もう一回だけ走らせてもらおか」
        voice_character_id: char_obachan
      - text: おばちゃんは深呼吸して、スタートラインへ戻っていった。
        voice_character_id: null
    next_scene: scene_ch3_arcade_event_start
  - id: scene_arcade_default
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch3_second_ticket_given_to_obachan
            value: true
          next_scene: scene_ch3_arcade_event_start
        - condition:
            and:
              - flag: flag_ch3_second_ticket_got
                value: true
              - flag: flag_ch3_second_ticket_given_to_obachan
                value: false
          next_scene: scene_ch3_arcade_give_second_ticket
        - condition:
            and:
              - flag: flag_ch3_ticket_given_to_bad_kids
                value: true
              - flag: flag_ch3_second_ticket_got
                value: false
          next_scene: scene_ch3_arcade_need_second_ticket
        - condition:
            flag: flag_ch3_ticket_stolen
            value: true
          next_scene: scene_ch3_arcade_ticket_stolen_hint
        - condition:
            flag: flag_ch3_ticket_given
            value: true
          next_scene: scene_ch3_arcade_with_obachan
        - condition: null
          next_scene: scene_ch3_arcade_no_ticket
  - id: scene_ch3_arcade_no_ticket
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: アーケード街の前に来た。ここがアメちゃんイベントの会場か
        voice_character_id: null
  - id: scene_ch3_arcade_need_second_ticket
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: アーケード街の入口では、イベントの受付が始まっていた。
        voice_character_id: null
      - text: 「アメ好きっ子はきっと楽しんどるやろな。うちらも、もう一枚なんとかせな」
        voice_character_id: char_obachan
      - text: ミュージアムへ戻って、もう一度チケットのことを相談してみよう。
        voice_character_id: null
  - id: scene_ch3_arcade_give_second_ticket
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: talking
    item_remove:
      - item_event_ticket
    flags_set:
      - flag: flag_ch3_second_ticket_given_to_obachan
        value: true
    messages:
      - text: アーケード街へ戻ると、おばちゃんが受付の前で待っていた。
        voice_character_id: null
      - text: 「おばちゃん、もう一枚もらってきたで」
        voice_character_id: char_hero
      - text: 「ほんまに？　ケンちゃん、また走り回ってくれたんやね」
        voice_character_id: char_obachan
      - text: 「今度こそ受付に出そう」
        voice_character_id: char_hero
      - text: 「ありがとうな。アメちゃん、全力で取りに行くで！」
        voice_character_id: char_obachan
    next_scene: scene_ch3_arcade_event_start
  - id: scene_ch3_arcade_with_obachan
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: アーケード街に足を踏み入れた。おばちゃんがスタンバイしている。
        voice_character_id: null
    talkable:
      - character_id: char_obachan
        scene_id: scene_talk_arcade_obachan
  - id: scene_talk_arcade_obachan
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: 「ケンちゃん、準備はええ？　全力で走るで！」
        voice_character_id: char_obachan
    next_engine:
      id: runner_action
      transition: speedline
      config:
        stageId: arcade_deathmatch
        name: アーケード街の死闘
        durationMs: 30000
        bgm: audio/bgm/rase.mp3
        bgmVolume: 0.24
        objectSpeedMultiplier: 1.25
        backgroundImage: runner/arcade_loop.jpg
        backgroundLoopWidth: 1352
        playerImage: runner/obachan.png
        playerWidth: 72
        playerHeight: 104
        theme:
          sky: "#151827"
          ground: "#2a2d32"
          accent: "#f2d16b"
      return_scene: scene_ch3_after_runner
`,u=`scenes:
  - id: scene_ch4_start
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_chapter
        value: 4
      - flag: flag_chapter1_cleared
        value: true
      - flag: flag_ch2_cleared
        value: true
      - flag: flag_ch3_cleared
        value: true
      - flag: flag_station_explored
        value: true
      - flag: flag_visited_slope
        value: true
      - flag: flag_ch3_museum_unlocked
        value: true
    messages:
      - text: 第4章
        voice_character_id: null
    next_scene: scene_ch4_monologue
  - id: scene_ch4_monologue
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    messages:
      - text: 五月晴れ。
        voice_character_id: null
      - text: 雲ひとつない青い空に、新緑のにおいが混じっている。
        voice_character_id: null
      - text: アメちゃん大会からしばらく経った。今日は特に予定もない。
        voice_character_id: null
      - text: でも、あの日の笑い声はまだ耳に残っている。
        voice_character_id: char_hero
      - text: おばちゃんが全力で走って、みんなが応援していた。
        voice_character_id: null
      - text: こんな日は、赤羽をぶらぶらしてみようか。
        voice_character_id: char_hero
    next_scene: scene_ch4_obachan_knee
  - id: scene_ch4_obachan_knee
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_ch4_obachan_knee_heard
        value: true
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
      - character_id: char_hero
        position: right
        expression: normal
    messages:
      - text: 広場に出ると、田村のおばちゃんがベンチに座っていた。
        voice_character_id: null
      - text: 「あら、ケンちゃん。ちょうどよかった」
        voice_character_id: char_obachan
      - text: 「どうしたんですか、おばちゃん」
        voice_character_id: char_hero
      - text: 「最近、膝がねえ……ずっと痛いんだよ。来年のアメちゃん大会、出れるかどうか分からなくなっちゃって」
        voice_character_id: char_obachan
      - text: 「え……」
        voice_character_id: char_hero
      - text: 「今年みんなと走れたのは良かったけどねえ。来年も走れたらいいなあと思ってたんだけど」
        voice_character_id: char_obachan
      - text: 「ほら、あのときケンちゃん、ずっと応援してくれたでしょう。あれが嬉しくてねえ」
        voice_character_id: char_obachan
      - text: おばちゃんは遠くを見て、静かに笑った。
        voice_character_id: null
      - text: （なんとかしてあげたいけど……）
        voice_character_id: char_hero
    next_scene: null
  - id: scene_danchi_morning
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
    messages: []
    talkable:
      - character_id: char_obachan
        scene_id: scene_ch4_talk_obachan
    branches:
      type: auto
      choices:
        - condition:
            and:
              - has_item: item_gummy_1
              - has_item: item_gummy_2
              - has_item: item_gummy_3
              - has_item: item_gummy_4
              - has_item: item_gummy_5
              - has_item: item_gummy_6
              - has_item: item_gummy_7
          next_scene: scene_ch4_wish
        - condition:
            and:
              - has_item: item_gummy_1
              - has_item: item_gummy_2
              - has_item: item_gummy_3
              - has_item: item_gummy_4
              - has_item: item_gummy_5
              - has_item: item_gummy_6
              - flag: flag_ch4_obachan_knee_heard
                value: true
          next_scene: scene_ch4_hint_seven
        - condition:
            flag: flag_ch4_obachan_knee_heard
            value: true
          next_scene: null
        - condition: null
          next_scene: scene_ch4_monologue
  - id: scene_station_default
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch4_detective_clue3
            value: true
          next_scene: scene_ch4_station_with_college
        - condition:
            and:
              - has_item: item_gummy_2
              - flag: flag_ch4_met_detective
                value: false
          next_scene: scene_ch4_station_detective_notice
        - condition:
            flag: flag_ch4_gummy_quest
            value: true
          next_scene: null
        - condition: null
          next_scene: scene_ch4_station_hint
  - id: scene_ch4_station_hint
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 駅前に出てきた。どこかに行ってみようかな。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_station_detective_notice
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    messages:
      - text: 駅前に出ると、ホームの端の方で誰かがこちらに向かって手招きしているのに気づいた。
        voice_character_id: null
      - text: 中年の男だ。「こっちに来い」というように、大きくジェスチャーしている。
        voice_character_id: null
      - text: （なんだろう……駅の端の方に行ってみるべきか）
        voice_character_id: char_hero
  - id: scene_ch4_station_with_college
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    talkable:
      - character_id: char_college_student
        scene_id: scene_ch4_station_college_talk
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch4_detective_clue4
            value: true
          next_scene: null
        - condition: null
          next_scene: scene_ch4_station_college_first
  - id: scene_ch4_station_college_first
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    talkable:
      - character_id: char_college_student
        scene_id: scene_ch4_station_college_talk
    messages: []
    next_scene: null
  - id: scene_ch4_station_college_talk
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch4_detective_clue4
            value: true
          next_scene: scene_ch4_station_college_repeat
        - condition: null
          next_scene: scene_ch4_station_college_clue4
  - id: scene_ch4_station_college_clue4
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_ch4_detective_clue4
        value: true
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages:
      - text: 「あ！　ケンくん、ちょうどよかった！」
        voice_character_id: char_college_student
      - text: 「どうしたんですか？」
        voice_character_id: char_hero
      - text: 「さっきあの子猫、また見かけたんです。改札の前を走り抜けて、公園の方へ向かっていきました！」
        voice_character_id: char_college_student
      - text: 「公園！？アーケード街の方か」
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_station_college_repeat
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages:
      - text: 「公園が怪しいと思うよ！」
        voice_character_id: char_college_student
    next_scene: null
  - id: scene_coderdojo_default
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_kinchu_hikari
          next_scene: scene_ch4_coderdojo_area
        - condition:
            flag: flag_ch4_maze_appeared
            value: true
          next_scene: scene_ch4_coderdojo_area
        - condition:
            flag: flag_ch4_gummy_quest
            value: true
          next_scene: scene_ch4_coderdojo_area
        - condition: null
          next_scene: scene_ch4_coderdojo_first
  - id: scene_ch4_coderdojo_first
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: normal
    messages:
      - text: 今日はCoderDojoの日だ。田中メンターが来ていた。
        voice_character_id: null
    next_scene: scene_ch4_coderdojo_area
  - id: scene_ch4_coderdojo_area
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: normal
    talkable:
      - character_id: char_mentor
        scene_id: scene_ch4_coderdojo_mentor
    clickable_areas:
      - id: area_ch4_coderdojo_juice
        x: 89
        "y": 394
        width: 52
        height: 70
        label: ジュース
        next_scene: scene_ch4_coderdojo_examine_juice
        condition: null
      - id: area_ch4_coderdojo_milktea
        x: 704
        "y": 390
        width: 87
        height: 69
        label: ティー
        next_scene: scene_ch4_coderdojo_examine_milktea
        condition: null
    messages: []
    child_scenes:
      - id: scene_ch4_coderdojo_examine_juice
        location_id: loc_coderdojo
        messages: []
        branches:
          type: auto
          choices:
            - condition:
                has_item: item_drink
              next_scene: scene_ch4_coderdojo_juice_have
            - condition: null
              next_scene: scene_ch4_coderdojo_juice_get
        child_scenes:
          - id: scene_ch4_coderdojo_juice_get
            location_id: loc_coderdojo
            item_give:
              - item_id: item_drink
                condition: null
            messages:
              - text: 机の上に置きっぱなしのジュースがある。
                voice_character_id: null
              - text: （もらっておこう）
                voice_character_id: char_hero
            next_scene: null
          - id: scene_ch4_coderdojo_juice_have
            location_id: loc_coderdojo
            messages:
              - text: ジュースはもう持っている。
                voice_character_id: null
            next_scene: null
      - id: scene_ch4_coderdojo_examine_milktea
        location_id: loc_coderdojo
        messages: []
        branches:
          type: auto
          choices:
            - condition:
                has_item: item_milktea
              next_scene: scene_ch4_coderdojo_milktea_have
            - condition: null
              next_scene: scene_ch4_coderdojo_milktea_get
        child_scenes:
          - id: scene_ch4_coderdojo_milktea_get
            location_id: loc_coderdojo
            item_give:
              - item_id: item_milktea
                condition: null
            messages:
              - text: 机の端にミルクティーが置いてある。まだ温かそうだ。
                voice_character_id: null
              - text: （もらっておこう）
                voice_character_id: char_hero
            next_scene: null
          - id: scene_ch4_coderdojo_milktea_have
            location_id: loc_coderdojo
            messages:
              - text: ミルクティーはもう持っている。
                voice_character_id: null
            next_scene: null
  - id: scene_ch4_coderdojo_mentor
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_kinchu_hikari
          next_scene: scene_ch4_coderdojo_done
        - condition:
            flag: flag_ch4_maze_appeared
            value: true
          next_scene: scene_ch4_coderdojo_ofuda
        - condition: null
          next_scene: scene_ch4_coderdojo_chat
  - id: scene_ch4_coderdojo_chat
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: normal
    messages:
      - text: 「おー、ケンちゃん！　今日もがんばろう」
        voice_character_id: char_mentor
      - text: 「はい」
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_coderdojo_ofuda
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: normal
    messages:
      - text: 「田中メンター……一番街に変な霧が出てて、迷路みたいになってて」
        voice_character_id: char_hero
      - text: 「え、本当に？　それはまずいんじゃないかな」
        voice_character_id: char_mentor
      - text: メンターはカバンをごそごそ探って、折り畳まれた紙を取り出した。
        voice_character_id: null
    next_scene: scene_ch4_coderdojo_ofuda_give
  - id: scene_ch4_coderdojo_ofuda_give
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/station.mp3
    overlay_image: cg/get_superitem.jpg
    characters:
      - character_id: char_mentor
        position: center
        expression: normal
    item_give:
      - item_id: item_kinchu_hikari
        condition: null
    messages:
      - text: 「これ、知り合いにもらったおふだだよ。よくわからないけど、一応持っておいて」
        voice_character_id: char_mentor
      - text: 「悪霊退散って書いてある……」
        voice_character_id: char_hero
      - text: 「気持ちの問題だよ。でも、いざとなったら使ってみ」
        voice_character_id: char_mentor
      - text: おふだを受け取った。
        voice_character_id: null
    next_scene: null
  - id: scene_ch4_coderdojo_done
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: normal
    messages:
      - text: 「おふだ、役に立った？」
        voice_character_id: char_mentor
      - text: 「はい、助かりました」
        voice_character_id: char_hero
      - text: 「そりゃよかった。デバッグも根気だよ」
        voice_character_id: char_mentor
    next_scene: null
  - id: scene_ichibangai_default
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_oyaji
        position: center
        expression: normal
    messages: []
    talkable:
      - character_id: char_oyaji
        scene_id: scene_ch4_ichibangai_oyaji
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_gummy_6
          next_scene: null
        - condition:
            flag: flag_ch4_yui_maze_met
            value: true
          next_scene: scene_ch4_ichibangai_yui_ready
        - condition:
            item_count:
              items:
                - item_gummy_1
                - item_gummy_2
                - item_gummy_3
                - item_gummy_4
                - item_gummy_5
                - item_gummy_6
                - item_gummy_7
              min: 3
          next_scene: scene_ch4_ichibangai_yui
        - condition: null
          next_scene: null
  - id: scene_arcade_default
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: アーケード街。あのアメちゃん大会が懐かしい。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_arcade_no_quest
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: アーケード街。あのアメちゃん大会が懐かしい。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_park_default
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch4_detective_clue4
            value: true
          next_scene: scene_ch4_park_with_cat
        - condition:
            has_item: item_gummy_2
          next_scene: scene_ch4_park_after_trade
        - condition:
            flag: flag_ch4_gummy_quest
            value: true
          next_scene: scene_ch4_park_candy_kid
        - condition: null
          next_scene: scene_ch4_park_no_quest
  - id: scene_ch4_park_candy_kid
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_candy_kid
        position: center
        expression: normal
    talkable:
      - character_id: char_candy_kid
        scene_id: scene_ch4_park_talk
    messages: []
  - id: scene_ch4_park_after_trade
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    characters: []
    messages:
      - text: 公園に来た。少年の姿はもうなかった。
        voice_character_id: char_hero
  - id: scene_ch4_park_with_cat
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    characters: []
    clickable_areas:
      - id: area_park_bench_cat
        x: 49
        "y": 372
        width: 91
        height: 47
        label: ベンチの下
        next_scene: scene_ch4_park_find_cat
        condition:
          flag: flag_ch4_detective_solved
          value: false
      - id: area_park_bench_wallet
        x: 51
        "y": 375
        width: 91
        height: 44
        label: ベンチの下
        next_scene: scene_ch4_park_find_wallet
        condition:
          and:
            - flag: flag_ch4_detective_solved
              value: true
            - flag: flag_ch4_wallet_found
              value: false
    messages:
      - text: 赤羽公園。ベンチの下に何かいるような気がする。
        voice_character_id: char_hero
    next_scene: null
    child_scenes:
      - id: scene_ch4_park_find_wallet
        location_id: loc_park
        flags_set:
          - flag: flag_ch4_wallet_found
            value: true
        item_give:
          - item_id: item_wallet
            condition: null
        messages:
          - text: ベンチの下をもう一度よく覗いてみた。
            voice_character_id: null
          - text: ——小さな財布が、奥に挟まるように落ちていた。さっきは子猫の陰になっていて気づかなかったようだ。
            voice_character_id: null
            focus_overlay_image: cg/ch4_bench_wallet.png
          - text: （これ……梅の木公園のバイトのひとが探してたやつだ。届けに行かないと）
            voice_character_id: char_hero
        next_scene: null
  - id: scene_ch4_park_find_cat
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_ch4_detective_solved
        value: true
    characters:
      - character_id: char_hero
        position: right
        expression: normal
    item_give:
      - item_id: item_gummy_4
        condition: null
    messages:
      - text: ベンチの下を覗いてみると——小さな子猫がまるまって、金属のペンダントを前足で押さえていた。
        voice_character_id: null
        focus_overlay_image: cg/ch4_bench_cat_pendant.png
      - text: 「あっ……！」
        voice_character_id: char_hero
      - text: 後ろから探偵おやじが走ってきた。途中で柱に頭をぶつけたが、気にしていないようだった。
        voice_character_id: null
        characters:
          - character_id: char_detective
            position: left
            expression: normal
          - character_id: char_hero
            position: right
            expression: normal
      - text: 「見つけたぞ！！」
        voice_character_id: char_detective
      - text: 「子猫よ……戻ってきてくれたか」
        voice_character_id: char_detective
      - text: 探偵はペンダントをそっと受け取り、大切そうに胸にしまった。
        voice_character_id: null
      - text: 「ありがとう、ケン。約束どおり、これを受け取ってくれ」
        voice_character_id: char_detective
      - text: 探偵はポケットからグミをひとつ取り出して、名残惜しそうに一度だけ眺めた。
        voice_character_id: null
      - text: 「……本当は夜食にするつもりだったが、約束は約束だ」
        voice_character_id: char_detective
      - text: グミを受け取った。
        voice_character_id: null
      - text: ——子猫が去り、ベンチの下が静かになった。なんとなく、まだ何か落ちていそうな気がする。
        voice_character_id: null
    next_scene: null
  - id: scene_ch4_park_no_quest
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    characters: []
    messages:
      - text: 赤羽公園。今日はのんびりした雰囲気だ。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_museum_default
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_staff
        position: center
        expression: normal
    messages: []
    talkable:
      - character_id: char_museum_staff
        scene_id: scene_ch4_museum_staff
        condition:
          flag: flag_ch4_gummy_quest
          value: true
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_gummy_3
          next_scene: null
        - condition:
            flag: flag_ch4_gummy_quest
            value: true
          next_scene: null
        - condition: null
          next_scene: scene_ch4_museum_no_quest
  - id: scene_ch4_museum_no_quest
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/danchi.mp3
    characters: []
    messages:
      - text: 団地のミュージアム。今日は特に用事はない。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_slope_default
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages: []
    talkable:
      - character_id: char_college_student
        scene_id: scene_ch4_slope_college
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch4_detective_clue3
            value: true
          next_scene: scene_ch4_slope_no_college
        - condition:
            flag: flag_ch4_gummy_quest
            value: true
          next_scene: null
        - condition: null
          next_scene: scene_ch4_slope_first
  - id: scene_ch4_slope_no_college
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/danchi.mp3
    characters: []
    messages:
      - text: 坂に大学生の姿はなかった。
        voice_character_id: null
    next_scene: null
  - id: scene_ch4_slope_first
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    talkable:
      - character_id: char_college_student
        scene_id: scene_ch4_slope_college
    messages:
      - text: 団地への坂道。風が気持ちいい。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_plum_park_default
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/danchi.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch4_detective_clue2
            value: true
          next_scene: scene_ch4_plum_park_with_baito
        - condition: null
          next_scene: scene_ch4_plum_park_no_quest
  - id: scene_ch4_plum_park_no_quest
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/danchi.mp3
    characters: []
    messages:
      - text: 梅の木公園。もう花の季節ではなく緑が生い茂っている。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_plum_park_with_baito
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_part_timer
        position: center
        expression: normal
    talkable:
      - character_id: char_museum_part_timer
        scene_id: scene_ch4_plum_park_baito
    messages:
      - text: 梅の木公園。古い梅の木のそばに、ミュージアムのバイトの人がいる。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_plum_park_baito
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_part_timer
        position: center
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_wallet
          next_scene: scene_ch4_plum_park_wallet_return
        - condition:
            has_item: item_gummy_5
          next_scene: scene_ch4_plum_park_baito_done
        - condition:
            flag: flag_ch4_detective_clue3
            value: true
          next_scene: scene_ch4_plum_park_baito_repeat
        - condition: null
          next_scene: scene_ch4_plum_park_baito_clue3
  - id: scene_ch4_plum_park_baito_clue3
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_ch4_detective_clue3
        value: true
    characters:
      - character_id: char_museum_part_timer
        position: center
        expression: normal
    messages:
      - text: 「あ、ケン君。こんにちは。実はここで財布なくしちゃって。ずっと探してるんですけど全然見つからなくて」
        voice_character_id: char_museum_part_timer
      - text: 「財布……」
        voice_character_id: char_hero
      - text: 「あ、いいんですよもうすこし探します。よく落としちゃうんですよね」
        voice_character_id: char_museum_part_timer
      - text: 「あの……実は僕も子猫を探してるんですけど、見ませんでしたか？　こっちに来たらしくて」
        voice_character_id: char_hero
      - text: 「あ！　さっきいましたよ！　梅の木の根元でしばらくじっとしてたんですけど、急に走り出して……」
        voice_character_id: char_museum_part_timer
      - text: 「どっちへ？」
        voice_character_id: char_hero
      - text: 「駅の方へ走っていきました。めちゃ速かったです」
        voice_character_id: char_museum_part_timer
      - text: 「駅！　ありがとうございます！」
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_plum_park_baito_repeat
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_part_timer
        position: center
        expression: normal
    messages:
      - text: 「駅の方へ走っていきましたよ、確かに。財布も探してるんですよね……」
        voice_character_id: char_museum_part_timer
    next_scene: null
  - id: scene_ch4_plum_park_wallet_return
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_part_timer
        position: center
        expression: normal
    item_give:
      - item_id: item_gummy_5
        condition: null
    item_remove:
      - item_wallet
    messages:
      - text: 「あの、これ……財布じゃないですか？」
        voice_character_id: char_hero
      - text: 「え！？」
        voice_character_id: char_museum_part_timer
      - text: 「公園のベンチの下で見つけました。猫が持ってたみたいで」
        voice_character_id: char_hero
      - text: 「本当に！？　よかったー！！　ずっと探してたんです！！」
        voice_character_id: char_museum_part_timer
      - text: 「よかったです」
        voice_character_id: char_hero
      - text: 「お礼に……これ、もらいものなんですけど、よかったら」
        voice_character_id: char_museum_part_timer
      - text: バイトはポケットからグミをひとつ取り出して、ケンに差し出した。
        voice_character_id: null
      - text: 「なくさないように気をつけてくださいね。私もよくなくすので！」
        voice_character_id: char_museum_part_timer
      - text: グミを受け取った。
        voice_character_id: null
    next_scene: null
  - id: scene_ch4_plum_park_baito_done
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_part_timer
        position: center
        expression: normal
    messages:
      - text: 「財布も見つかって、本当に助かりました！　グミ集め、がんばってください！」
        voice_character_id: char_museum_part_timer
    next_scene: null
  - id: scene_station_end_default
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages: []
    talkable:
      - character_id: char_detective
        scene_id: scene_ch4_detective
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_gummy_4
          next_scene: null
        - condition:
            flag: flag_ch4_gummy_quest
            value: true
          next_scene: null
        - condition: null
          next_scene: scene_ch4_station_end_no_quest
  - id: scene_ch4_station_end_no_quest
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 駅の端。ホームの隅で、電車が遠ざかっていく。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_slope_college
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch4_detective_clue1
            value: true
          next_scene: scene_ch4_slope_college_repeat
        - condition:
            and:
              - has_item: item_gummy_1
              - flag: flag_ch4_met_detective
                value: true
          next_scene: scene_ch4_slope_college_clue
        - condition: null
          next_scene: scene_ch4_slope_college_first
  - id: scene_ch4_slope_college_first
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_ch4_gummy_quest
        value: true
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    item_give:
      - item_id: item_gummy_1
        condition: null
    messages:
      - text: 「あ、こんにちは！　散歩ですか？」
        voice_character_id: char_college_student
      - text: 「うん。特に用事もないから、ぶらぶらしてて」
        voice_character_id: char_hero
      - text: 「そういえば、ちょっと面白い話、知ってますか？」
        voice_character_id: char_college_student
      - text: 「面白い話？」
        voice_character_id: char_hero
      - text: 「この赤羽には昔から伝わる言い伝えがあって……七つのグミを集めると、願いが叶うって言うんですよ」
        voice_character_id: char_college_student
      - text: 「七つのグミ……」
        voice_character_id: char_hero
      - text: 「もちろん、ただの都市伝説かもしれません。でも、誰かのために集めると効くって話なんです」
        voice_character_id: char_college_student
      - text: 「ほら、これ。僕が持ってたグミのひとつ。よかったら最初の一個、どうぞ」
        voice_character_id: char_college_student
      - text: ケンの頭に、おばちゃんの顔が浮かんだ。
        voice_character_id: null
      - text: （おばちゃんの膝が治るように……七つ集めてみよう）
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_slope_college_repeat
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages: []
    talkable:
      - character_id: char_college_student
        scene_id: scene_ch4_slope_college_clue
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch4_detective_clue1
            value: true
          next_scene: null
        - condition: null
          next_scene: null
  - id: scene_ch4_slope_college_clue
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_ch4_detective_clue1
        value: true
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages:
      - text: 「あ、そういえば今日、駅の端の方から小さな子猫が走ってくるのを見ましたよ」
        voice_character_id: char_college_student
      - text: 「子猫？　何か咥えてた？」
        voice_character_id: char_hero
      - text: 「そうなんです！　光るものを口に咥えたまま、団地の方へ向かっていきました」
        voice_character_id: char_college_student
      - text: 「団地の方へ……」
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_park_talk
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_candy_kid
        position: center
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_gummy_2
          next_scene: scene_ch4_park_done
        - condition:
            has_item: item_candy
          next_scene: scene_ch4_park_trade
        - condition: null
          next_scene: scene_ch4_park_no_candy
  - id: scene_ch4_park_trade
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_candy_kid
        position: center
        expression: normal
    item_give:
      - item_id: item_gummy_2
        condition: null
    item_remove:
      - item_candy
    messages:
      - text: 「あ、ケン兄ちゃん！　グミ集めてるって聞いたよ！」
        voice_character_id: char_candy_kid
      - text: 「え、もう知ってるの？」
        voice_character_id: char_hero
      - text: 「おばちゃんから聞いた！　ぼくんちにグミあるよ！　アメちゃんと交換して！」
        voice_character_id: char_candy_kid
      - text: 「……いいよ。じゃあこれ」
        voice_character_id: char_hero
      - text: 「やった！　このアメちゃん、田村のおばちゃんのやつだ。包み紙の折り方で分かるんだ」
        voice_character_id: char_candy_kid
      - text: アメちゃんをひとつ渡すと、少年は嬉しそうにグミをくれた。
        voice_character_id: null
    next_scene: null
  - id: scene_ch4_park_no_candy
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_candy_kid
        position: center
        expression: normal
    messages:
      - text: 「ケン兄ちゃん！　グミ欲しかったらアメちゃんと交換してよ！」
        voice_character_id: char_candy_kid
      - text: 「アメちゃんか……今は持ってないな」
        voice_character_id: char_hero
      - text: 「田村のおばちゃん、いつも持ってるよ。お願いしたらくれるかも！」
        voice_character_id: char_candy_kid
      - text: 「おばちゃんに聞いてみようかな」
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_park_done
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_candy_kid
        position: center
        expression: normal
    messages:
      - text: 「グミ、ちゃんと持ってる？ 全部集めてね！」
        voice_character_id: char_candy_kid
    next_scene: null
  - id: scene_ch4_museum_staff
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_staff
        position: center
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_gummy_3
          next_scene: scene_ch4_museum_done
        - condition: null
          next_scene: scene_ch4_museum_challenge
  - id: scene_ch4_museum_challenge
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_staff
        position: center
        expression: talking
    messages:
      - text: 「ふはは……来たな、グミを求める者よ」
        voice_character_id: char_museum_staff
      - text: 「え、知ってるの？」
        voice_character_id: char_hero
      - text: 「我が秘蔵のグミ、欲しくば勝負せよ……フラッシュ暗算じゃ！」
        voice_character_id: char_museum_staff
      - text: 「フラッシュ暗算？」
        voice_character_id: char_hero
      - text: 「次々と現れる数を頭で足していくのじゃ。5問中4問正解すれば合格！」
        voice_character_id: char_museum_staff
      - text: 「わかった。やってみる」
        voice_character_id: char_hero
    next_engine:
      id: flash_calc
      transition: numberstorm
      config:
        difficulty: easy
        rounds: 5
      return_scene: scene_ch4_museum_result
  - id: scene_ch4_museum_result
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/danchi.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flash_calc_passed
            value: true
          next_scene: scene_ch4_museum_win
        - condition: null
          next_scene: scene_ch4_museum_lose
  - id: scene_ch4_museum_win
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_ch4_museum_duel_won
        value: true
    characters:
      - character_id: char_museum_staff
        position: center
        expression: normal
    item_give:
      - item_id: item_gummy_3
        condition: null
    messages:
      - text: 「ぐ……！　我としたことが……」
        voice_character_id: char_museum_staff
      - text: 「……約束どおり、このグミを渡そう。まあ……見どころのある者じゃ」
        voice_character_id: char_museum_staff
      - text: グミを受け取った。
        voice_character_id: null
    next_scene: null
  - id: scene_ch4_museum_lose
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_staff
        position: center
        expression: normal
    messages:
      - text: 「くっくっく……4問以上当てれば合格じゃ。まだ修行が足りぬな」
        voice_character_id: char_museum_staff
      - text: 「……もう一回！」
        voice_character_id: char_hero
    next_scene: scene_ch4_museum_challenge
  - id: scene_ch4_museum_done
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_staff
        position: center
        expression: normal
    messages:
      - text: 「残り少ないな、グミ集め。……健闘を祈る」
        voice_character_id: char_museum_staff
    next_scene: null
  - id: scene_ch4_detective
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_gummy_4
          next_scene: scene_ch4_detective_done
        - condition:
            flag: flag_ch4_detective_solved
            value: true
          next_scene: scene_ch4_detective_done
        - condition:
            flag: flag_ch4_detective_clue3
            value: true
          next_scene: scene_ch4_detective_wait_clue4
        - condition:
            flag: flag_ch4_detective_clue2
            value: true
          next_scene: scene_ch4_detective_wait_clue3
        - condition:
            flag: flag_ch4_detective_clue1
            value: true
          next_scene: scene_ch4_detective_wait_clue2
        - condition:
            flag: flag_ch4_met_detective
            value: true
          next_scene: scene_ch4_detective_wait_clue1
        - condition: null
          next_scene: scene_ch4_detective_intro
  - id: scene_ch4_detective_intro
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_ch4_met_detective
        value: true
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: ホームの端に、中年男性が立っていた。
        voice_character_id: null
      - text: 男は自動販売機の下をのぞきこんで、落ちていた十円玉をすばやくポケットに入れた。
        voice_character_id: null
      - text: 「……おや、見てたか。これは現場保存というやつだ」
        voice_character_id: char_detective
      - text: 「え、探偵さん？」
        voice_character_id: char_hero
      - text: 「そうだ。赤羽の探偵、と呼んでくれ。交番には顔が利く。主に、怒られる方でな」
        voice_character_id: char_detective
      - text: 「俺のロケットペンダント、さっきここのベンチで子猫に取られてしまったんだ。大事な形見でな」
        voice_character_id: char_detective
      - text: 「子猫が……ペンダントを？」
        voice_character_id: char_hero
      - text: 「そうだ。赤羽のどこかに逃げたはずだが……俺は今、駅員に見つかるとちょっとまずい」
        voice_character_id: char_detective
      - text: 「何したんですか」
        voice_character_id: char_hero
      - text: 「切符をなくしただけだ。たぶん。細かいことはいい。情報を集めて、どこへ行ったか突き止めてくれないか。礼はするぞ」
        voice_character_id: char_detective
      - text: 「子猫は団地への坂道あたりへ走ったように見えた。まずあのあたりにいる人に聞いてみてくれ」
        voice_character_id: char_detective
      - text: 「わかりました。調べてみます」
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch4_detective_wait_clue1
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 「どうだ、坂道あたりで何か分かったか」
        voice_character_id: char_detective
      - text: 探偵おやじは売店の試食品を、やけに堂々と三つ食べていた。
        voice_character_id: null
      - text: 「まだで……」
        voice_character_id: char_hero
      - text: 「団地への坂に若い大学生がよくいるだろ。あいつに聞いてみてくれ」
        voice_character_id: char_detective
    next_scene: null
  - id: scene_ch4_detective_wait_clue2
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 「大学生から話を聞いたか。次は団地のおばちゃんに聞いてみてくれ。あの人は、この辺りを一番よく見てる」
        voice_character_id: char_detective
    next_scene: null
  - id: scene_ch4_detective_wait_clue3
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 「おばちゃんから梅の木公園と聞いたか。次はあの公園だ。あのあたりに詳しいやつがいるはずだ」
        voice_character_id: char_detective
    next_scene: null
  - id: scene_ch4_detective_wait_clue4
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 「もうあとは赤羽公園のベンチの下を確認するだけだ。急いでくれ」
        voice_character_id: char_detective
    next_scene: null
  - id: scene_ch4_detective_done
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 「ペンダントも無事戻った。本当に助かったよ、ありがとう」
        voice_character_id: char_detective
    next_scene: null
  - id: scene_ch4_talk_obachan
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch4_gummy_quest
                value: true
              - has_item: item_candy
                negate: true
              - has_item: item_gummy_2
                negate: true
          next_scene: scene_ch4_obachan_candy
        - condition:
            and:
              - flag: flag_ch4_detective_clue1
                value: true
              - flag: flag_ch4_detective_clue2
                value: false
          next_scene: scene_ch4_obachan_clue2
        - condition: null
          next_scene: scene_ch4_obachan_chat
  - id: scene_ch4_obachan_candy
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_obachan
        position: left
        expression: talking
      - character_id: char_hero
        position: right
        expression: normal
    item_give:
      - item_id: item_candy
        condition: null
    messages:
      - text: 「七つのグミ、集めることにしたんだねえ」
        voice_character_id: char_obachan
      - text: 「うん。まだ本当に願いが叶うかは分からないけど」
        voice_character_id: char_hero
      - text: 「分からないことに本気になるのが、子どもの強さだよ」
        voice_character_id: char_obachan
      - text: おばちゃんは買い物袋をごそごそ探って、小さなアメちゃんをひとつ取り出した。
        voice_character_id: null
      - text: 「これ、持っておいき。赤羽ではね、アメちゃんは挨拶にも、仲直りにも、交渉にも使えるんだから」
        voice_character_id: char_obachan
      - text: 「交渉……？」
        voice_character_id: char_hero
      - text: 「ふふ。ケンちゃんなら、きっと使いどころが分かるよ」
        voice_character_id: char_obachan
      - text: アメちゃんをもらった。
        voice_character_id: null
        characters:
          - character_id: char_obachan
            position: left
            expression: normal
          - character_id: char_hero
            position: right
            expression: normal
    next_scene: null
  - id: scene_ch4_obachan_clue2
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_ch4_detective_clue2
        value: true
    characters:
      - character_id: char_obachan
        position: left
        expression: talking
    messages:
      - text: 「ケンちゃん、グミ集めてるんだって？　がんばってるねえ」
        voice_character_id: char_obachan
      - text: 「うん。あ、おばちゃん、さっき子猫見た？」
        voice_character_id: char_hero
      - text: 「子猫？　ああ、さっき梅の木公園の方へ走っていくのを見たよ。何かキラキラしたもの咥えてたねえ」
        voice_character_id: char_obachan
      - text: 「梅の木公園か……行ってみよう」
        voice_character_id: char_hero
      - text: 梅の木公園——団地のすぐ脇にある、小さな公園だ。
        voice_character_id: null
      - text: 梅の木がたくさん生えていて、ケンはいつも通り過ぎるだけで、ちゃんと入ったことはなかった。
        voice_character_id: null
    next_scene: null
  - id: scene_ch4_obachan_chat
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
    messages:
      - text: 「ケンちゃん、がんばってるね。応援してるよ」
        voice_character_id: char_obachan
    next_scene: null
  - id: scene_ch4_ichibangai_oyaji
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_oyaji
        position: center
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_gummy_6
          next_scene: scene_ch4_ichibangai_done
        - condition:
            flag: flag_ch4_gummy_quest
            value: true
          next_scene: scene_ch4_ichibangai_oyaji_wait
        - condition: null
          next_scene: scene_ch4_ichibangai_oyaji_first
  - id: scene_ch4_ichibangai_oyaji_first
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_oyaji
        position: center
        expression: normal
    messages:
      - text: 「おう、ケンちゃん。今日はひとりで散歩か」
        voice_character_id: char_oyaji
      - text: 「うん。一番街、今日は普通ですね」
        voice_character_id: char_hero
      - text: 「普通が一番じゃ。普通じゃない一番街は、ろくなことにならんからな」
        voice_character_id: char_oyaji
    next_scene: null
  - id: scene_ch4_ichibangai_oyaji_wait
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_oyaji
        position: center
        expression: talking
    messages:
      - text: 「七つのグミを集めてるんだってな」
        voice_character_id: char_oyaji
      - text: 「おじさんも知ってるんですか」
        voice_character_id: char_hero
      - text: 「ああ。わしも昔、七つのグミで願いを叶えようとしたもんじゃ。……まあ、叶わなかったけどな」
        voice_character_id: char_oyaji
      - text: 「え……大丈夫でしたか？」
        voice_character_id: char_hero
      - text: 「ガハハ、大丈夫大丈夫。叶わなかった願いも、あとで笑い話になる。赤羽はそういう街じゃ」
        voice_character_id: char_oyaji
    next_scene: null
  - id: scene_maze_event_01
    location_id: loc_ichibangai
    background: backgrounds/inner_ichibangai_dark.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
    item_give:
      - item_id: item_fushigi_candy
        condition:
          has_item: item_fushigi_candy
          negate: true
    messages:
      - text: ——突然、視界が歪んだ。
        voice_character_id: null
      - text: そこには、見覚えのある顔があった。
        voice_character_id: null
      - text: 「……田村のおばちゃん？　なんでここに」
        voice_character_id: char_hero
      - text: 「あら、ケンちゃん。こんなとこまで来てがんばってるんやね」
        voice_character_id: char_obachan
      - text: 「ほら、あめちゃん。お腹すいたやろ」
        voice_character_id: char_obachan
      - text: ——気づくと、おばちゃんの姿は消えていた。手のひらの中に、アメが一粒残っていた。
        voice_character_id: null
    next_engine:
      id: __return__
      transition: rift
  - id: scene_ch4_ichibangai_yui
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    flags_set:
      - flag: flag_ch4_yui_maze_met
        value: true
      - flag: flag_ch4_maze_appeared
        value: true
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 一番街の入口に近づいた瞬間、空気が冷たく沈んだ。
        voice_character_id: null
      - text: 一番街のゲートの奥から、白い霧のようなものが流れてくる。
        voice_character_id: null
      - text: 「……ケン」
        voice_character_id: char_yui
      - text: 「ユイ？　どうしてここに」
        voice_character_id: char_hero
      - text: 「嫌な予感がして、見に来てみたらやっぱりこうなってた」
        voice_character_id: char_yui
      - text: 「また、あの迷路……」
        voice_character_id: char_hero
      - text: 「悪霊が出てくるかもしれない。見に行かないと」
        voice_character_id: char_yui
    next_scene: scene_ch4_ichibangai_challenge
  - id: scene_ch4_ichibangai_yui_ready
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    flags_set:
      - flag: flag_ch4_maze_appeared
        value: true
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: ユイが霧の前に立っていた。
        voice_character_id: null
      - text: 「来た。準備できた？」
        voice_character_id: char_yui
    next_scene: scene_ch4_ichibangai_challenge
  - id: scene_ch4_ichibangai_challenge
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch4_ichibangai_yui_ready
    messages:
      - text: 「行こう。ここを抜けた先に、次のグミがある」
        voice_character_id: char_yui
    branches:
      type: choice
      choices:
        - label: 「うん、行こう」
          next_scene: scene_ch4_maze_enter
        - label: 「少し準備してから来る」
          next_scene: null
  - id: scene_ch4_maze_enter
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_kinchu_hikari
          next_scene: scene_ch4_maze_enter_go
        - condition: null
          next_scene: scene_ch4_maze_no_ofuda
  - id: scene_ch4_maze_no_ofuda
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 「ちょっと待って」
        voice_character_id: char_yui
      - text: 「おふだ、持ってる？　あれないと悪霊に対抗できないよ」
        voice_character_id: char_yui
      - text: 「おふだってどこかでもらえたっけ、、」
        voice_character_id: char_yui
    next_scene: null
  - id: scene_ch4_maze_enter_go
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 「うん」
        voice_character_id: char_hero
    next_engine:
      id: maze_rpg
      transition: rift
      config:
        map: dungeon_03
        minimapMode: visited
        name: 一番街の霊気
        bgm: audio/bgm/dungeon.mp3
        battleBgm: audio/bgm/buttle.mp3
        theme:
          wallFront: "#584060"
          wallSide: "#2e1e38"
          ceilTop: "#02000c"
          ceilBottom: "#0a0618"
          floorTop: "#060410"
          floorBottom: "#030208"
          uiBg: "#04020e"
          uiAccent: "#c080ff"
          uiBorder: "#3a2060"
        events:
          E: scene_maze_event_01
        itemEffects:
          item_candy:
            healHp: full
          item_fushigi_candy:
            healHp: full
          item_drink:
            healHp: full
          item_milktea:
            healHp: full
          item_kinchu_hikari:
            attackEnemy: 999
      return_scene: scene_ch4_ichibangai_maze_result
      gameover_scene: scene_ch4_maze_gameover
      gameover_boss_scene: scene_ch4_boss_gameover
      gameover_landing_scene: scene_ichibangai_default
  - id: scene_ch4_maze_gameover
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: right
        expression: sad
    messages:
      - text: 霧の中で、ユイの声がした。
        voice_character_id: null
      - text: 「ケン……！　よかった、出てきた」
        voice_character_id: char_yui
      - text: 「ごめん……追い返されちゃった」
        voice_character_id: char_hero
      - text: 「……もう一回、行く？」
        voice_character_id: char_yui
      - text: 「うん。もう一回」
        voice_character_id: char_hero
      - text: 「……わかった。一緒に行く」
        voice_character_id: char_yui
    next_scene: scene_ch4_maze_retry
  - id: scene_ch4_maze_retry
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: right
        expression: normal
    messages:
      - text: 「……行こ。今度こそ大丈夫」
        voice_character_id: char_yui
    branches:
      type: choice
      choices:
        - label: 「うん、もう一回」
          next_scene: scene_ch4_maze_reenter
        - label: 「少し準備してから来る」
          next_scene: null
  - id: scene_ch4_maze_reenter
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    messages: []
    next_engine:
      id: __return__
      transition: rift
  - id: scene_ch4_boss_gameover
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: right
        expression: sad
    messages:
      - text: 霧の外に、弾き出された。
        voice_character_id: null
      - text: 「ケン……ボスが強かった。でも、あと少しだったよ」
        voice_character_id: char_yui
      - text: 「もう一回行ける。あそこまでの道はもう分かってる」
        voice_character_id: char_hero
      - text: 「……うん。今度こそ一緒に倒そう」
        voice_character_id: char_yui
    next_scene: scene_ch4_boss_maze_retry
  - id: scene_ch4_boss_maze_retry
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: right
        expression: normal
    messages:
      - text: 「あそこまでの道はもう分かってる。行ける」
        voice_character_id: char_yui
    branches:
      type: choice
      choices:
        - label: 「うん、今度こそ倒す」
          next_scene: scene_ch4_boss_maze_reenter
        - label: 「少し準備してから来る」
          next_scene: null
  - id: scene_ch4_boss_maze_reenter
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    messages: []
    next_engine:
      id: __return__
      transition: rift
  - id: scene_ch4_ichibangai_maze_result
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_oyaji
        position: center
        expression: normal
    talkable:
      - character_id: char_oyaji
        scene_id: scene_ch4_ichibangai_done
    item_give:
      - item_id: item_gummy_6
        condition: null
    messages:
      - text: 「ああああ　またやってしもうた。飲みすぎた」
        voice_character_id: char_oyaji
      - text: おじさん、しっかりしてよ。こっちは大変なんだから。
        voice_character_id: char_hero
      - text: 飲みすぎると、こうなるの、、？
        voice_character_id: char_yui
      - text: 「このグミをやるから、かんにんしておくれ」
        voice_character_id: char_oyaji
      - text: グミを受け取った。
        voice_character_id: null
    next_scene: null
  - id: scene_ch4_ichibangai_done
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_oyaji
        position: center
        expression: normal
    talkable:
      - character_id: char_oyaji
        scene_id: scene_ch4_ichibangai_done
    messages:
      - text: 「残りもがんばれよ。応援してるぞ」
        voice_character_id: char_oyaji
    next_scene: null
  - id: scene_ch4_hint_seven
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_hero
        position: center
        expression: normal
    messages:
      - text: あと一個……どこにあるんだろう。
        voice_character_id: char_hero
      - text: 伝説では、七つ目のグミは「一番身近な人が持っている」と言われているらしい。
        voice_character_id: null
      - text: （一番身近な人……）
        voice_character_id: char_hero
    next_scene: scene_ch4_wish
  - id: scene_ch4_obachan_last
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
      - character_id: char_hero
        position: right
        expression: normal
    item_give:
      - item_id: item_gummy_7
        condition: null
    messages:
      - text: 「おばちゃん、あのさ……」
        voice_character_id: char_hero
      - text: 「どうしたんだい、ケンちゃん。真剣な顔して」
        voice_character_id: char_obachan
      - text: 「七つのグミ、あと一個で揃うんだけど……七つ目は一番身近な人が持ってるって」
        voice_character_id: char_hero
      - text: おばちゃんはしばらくじっとケンを見ていた。それから、ゆっくりとポケットに手を入れた。
        voice_character_id: null
      - text: 「……あらまあ」
        voice_character_id: char_obachan
      - text: 「え……！」
        voice_character_id: char_hero
      - text: 「ずっとここにあったよ。なんとなく、ずっと持ってたんだよ、このグミ」
        voice_character_id: char_obachan
      - text: おばちゃんは、皺くちゃな手のひらにグミをひとつ乗せて差し出した。
        voice_character_id: null
      - text: 「どうぞ」
        voice_character_id: char_obachan
      - text: ケンの目が熱くなった。
        voice_character_id: char_hero
    next_scene: scene_ch4_wish
  - id: scene_ch4_wish
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_gummy_7
          next_scene: scene_ch4_wish_ceremony
        - condition: null
          next_scene: scene_ch4_obachan_last
  - id: scene_ch4_wish_ceremony
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
      - character_id: char_hero
        position: right
        expression: normal
    messages:
      - text: 七つのグミが揃った。
        voice_character_id: null
      - text: 「おばちゃん。おばちゃんの膝が治りますように、ってお願いしてもいい？」
        voice_character_id: char_hero
      - text: 「……ケンちゃん」
        voice_character_id: char_obachan
      - text: 「ずっと思ってたんだ。来年もおばちゃんとアメちゃん大会に出たくて」
        voice_character_id: char_hero
      - text: おばちゃんは目をうるませて、それからふっと笑った。
        voice_character_id: null
      - text: 「……ありがとう、ケンちゃん。お願いしていいよ」
        voice_character_id: char_obachan
      - text: ケンはそっと目を閉じて、七つのグミを手のひらで包んだ。
        voice_character_id: null
    next_scene: scene_ch4_ending
  - id: scene_ch4_ending
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    ending_title: 第4章　七つのグミ
    flags_set:
      - flag: flag_ch4_cleared
        value: true
    messages:
      - text: 五月の風が、団地の広場を静かに吹き抜けていった。
        voice_character_id: null
      - text: 願いが叶うかどうかは、誰にもわからない。
        voice_character_id: null
      - text: でも今この瞬間、ケンはそれよりも大切なことに気づいていた。
        voice_character_id: null
      - text: 赤羽のひとたちが、みんなで一緒にいてくれたこと。
        voice_character_id: null
    game_end: true
  - id: scene_use_candy
    overlay_image: cg/candy_happy.jpg
    item_remove:
      - item_candy
    messages:
      - text: アメをなめた。
        voice_character_id: null
      - text: 甘くておいしい。
        voice_character_id: null
      - text: ……なんだか、すごく幸せな気持ちになった。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_use_juice
    overlay_image: cg/happy_juice.jpg
    item_remove:
      - item_drink
    messages:
      - text: ジュースを飲んだ。
        voice_character_id: null
      - text: あっさりとしていて、とてもおいしい。
        voice_character_id: null
      - text: ……なんだか、すごく幸せな気持ちになった。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_use_milktea
    overlay_image: cg/happy_juice.jpg
    item_remove:
      - item_milktea
    messages:
      - text: ミルクティーを飲んだ。
        voice_character_id: null
      - text: やさしい甘さで、ほっとする味がした。
        voice_character_id: null
      - text: ……少し、気持ちが落ち着いた。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_use_fushigi_candy
    overlay_image: cg/candy_happy.jpg
    item_remove:
      - item_fushigi_candy
    messages:
      - text: 不思議なアメをなめた。
        voice_character_id: null
      - text: ひんやりしているのに、甘くてやさしい味がした。
        voice_character_id: null
      - text: ……体の中から、力が戻ってくる気がした。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_use_kinchu_hikari
    messages:
      - text: 悪霊退散のおふだを手に持ってみた。
        voice_character_id: null
      - text: かすかな輝きが、掌に温かく広がる。
        voice_character_id: char_hero
      - text: ……これは、迷宮の番人に向かって使おう。
        voice_character_id: char_hero
    next_scene: null

  - id: scene_museum_core_default
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    messages:
      - text: ミュージアムの中心部は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_history_room_default
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 「赤羽の歴史」の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_portrait_room_default
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 「人々の肖像」の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_storage_room_default
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 収蔵庫は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_deep_core_default
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    messages:
      - text: ミュージアムの奥は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_yui_room_default
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 記憶の展示室は、今日は閉じられている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_oyaji_room_default
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    messages:
      - text: 古い道具の部屋は、今日は閉じられている。
        voice_character_id: null
    next_scene: null
`,d=`scenes:
  - id: scene_ch5_start
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_chapter
        value: 5
      - flag: flag_chapter1_cleared
        value: true
      - flag: flag_ch2_cleared
        value: true
      - flag: flag_ch3_cleared
        value: true
      - flag: flag_ch4_cleared
        value: true
      - flag: flag_station_explored
        value: true
      - flag: flag_visited_slope
        value: true
      - flag: flag_ch3_museum_unlocked
        value: true
    messages:
      - text: 第5章
        voice_character_id: null
    next_scene: scene_ch5_danchi_intro
  - id: scene_ch5_danchi_intro
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_ch5_museum_alarm
        value: true
    characters:
      - character_id: char_hero
        position: left
        expression: normal
    messages:
      - text: 予定のない午後だった。
        voice_character_id: null
      - text: ケンは団地の広場を、特に行き先も決めずにぶらぶら歩いていた。
        voice_character_id: null
      - text: （今日は、ほんとに暇だな）
        voice_character_id: char_hero
      - text: そのとき、ミュージアムの方から誰かがよろめきながら走ってきた。
        voice_character_id: null
        characters:
          - character_id: char_hero
            position: left
            expression: normal
          - character_id: char_museum_part_timer
            position: right
            expression: normal
      - text: ミュージアムのバイトさんだった。服はほこりだらけで、手には折れた案内板を抱えている。
        voice_character_id: null
      - text: 「ケンさん……！　よかった、ここにいてくれて」
        voice_character_id: char_museum_part_timer
      - text: 「バイトさん……どうしたんですか」
        voice_character_id: char_hero
      - text: 「ミュージアムで異変が起きたんです。展示室の床が動いて、ケースが飛び出して、もう何がなんだか」
        voice_character_id: char_museum_part_timer
      - text: 「受付さんが様子を見に行ったんですけど、戻ってこなくて……」
        voice_character_id: char_museum_part_timer
      - text: バイトさんの声が震えていた。ほこりのついた袖を、ぎゅっと握っている。
        voice_character_id: null
      - text: （受付さんが戻ってこない……）
        voice_character_id: char_hero
      - text: 「僕も行きます。一緒にミュージアムへ行きましょう」
        voice_character_id: char_hero
      - text: 「はい……！　一緒に行きましょう」
        voice_character_id: char_museum_part_timer
    next_scene: null
  - id: scene_danchi_morning
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_part_timer
        position: right
        expression: normal
    messages: []
    talkable:
      - character_id: char_museum_part_timer
        scene_id: scene_ch5_talk_part_timer_at_danchi
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch5_museum_alarm
            value: true
          next_scene: null
        - condition: null
          next_scene: scene_ch5_danchi_intro
  - id: scene_ch5_talk_part_timer_at_danchi
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters:
      - character_id: char_museum_part_timer
        position: center
        expression: talking
    messages:
      - text: 「受付さん、強いから簡単にはやられないはずですが、、」
        voice_character_id: char_museum_part_timer
      - text: 「それが、戻ってこないんですね」
        voice_character_id: char_hero
      - text: 「はい。だから、私ひとりじゃなくて、ケンさんと一緒なら行けるかなって」
        voice_character_id: char_museum_part_timer
      - text: （説明はよく分からないけど、大変なのは分かる）
        voice_character_id: char_hero
    next_scene: null
  - id: scene_museum_default
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch5_action_cleared
            value: true
          next_scene: scene_ch5_museum_after_clear
        - condition: null
          next_scene: scene_ch5_museum_arrival
  - id: scene_ch5_museum_arrival
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: right
        expression: normal
    messages:
      - text: バイトさんに案内されてミュージアムに入ると、展示室の床がベルトコンベアみたいに右から左へ流れていた。
        voice_character_id: null
      - text: 壁の年表も、ケースの中の写真も、全部が少しずつ横へ滑っている。
        voice_character_id: null
      - text: 「ここから先です。受付さんは、この奥へ行ったまま戻ってきません」
        voice_character_id: char_museum_part_timer
      - text: 奥の額縁が光った。そこから、アメちゃんと展示ケースが交互に飛び出してくる。
        voice_character_id: null
    next_scene: scene_ch5_museum_enter_action
  - id: scene_ch5_museum_enter_action
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_part_timer
        position: right
        expression: normal
    messages:
      - text: この先を抜ければ、異変の中心にたどり着けるかもしれない。
        voice_character_id: char_hero
    branches:
      type: choice
      choices:
        - label: 美術館の建物へ入る
          condition: null
          next_scene: scene_ch5_museum_action_start
        - label: いったん戻る
          condition: null
          next_scene: null
  - id: scene_ch5_museum_action_start
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages:
      - text: ケンは息を吸って、光る額縁の中へ飛び込んだ。
        voice_character_id: null
    next_engine:
      id: runner_action
      transition: speedline
      config:
        stageId: museum_side_scroll
        mode: collect
        name: 走れ、団地のミュージアム
        durationMs: 30000
        stompEnemies: true
        lives: 3
        bgm: audio/bgm/rase.mp3
        bgmVolume: 0.24
        objectSpeedMultiplier: 1.15
        playerImage: runner/hero.png
        playerWidth: 74
        playerHeight: 104
        theme:
          sky: "#1f2630"
          ground: "#38403a"
          accent: "#f2d16b"
      return_scene: scene_ch5_museum_action_result
  - id: scene_ch5_museum_action_result
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: runner_action_result_museum_side_scroll
            value: complete
          next_scene: scene_ch5_museum_action_clear
        - condition:
            flag: runner_action_result_museum_side_scroll
            value: lose
          next_scene: scene_ch5_museum_action_gameover
        - condition: null
          next_scene: scene_ch5_museum_enter_action
  - id: scene_ch5_museum_action_gameover
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 展示室の流れに押し戻され、ケンは入口まで転がり出た。
        voice_character_id: null
      - text: （三回ミスしたら、ここまで戻されるんだ……でも、踏めば倒せる）
        voice_character_id: char_hero
      - text: 足元の敵も、空中の敵も、上から踏むタイミングを見れば進めるはずだ。
        voice_character_id: null
    next_scene: scene_ch5_museum_enter_action
  - id: scene_ch5_museum_action_clear
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_action_cleared
        value: true
    characters: []
    messages:
      - text: 額縁を抜けると、展示室の横流れがぴたりと止まった。
        voice_character_id: null
      - text: 入口の方を振り返っても、バイトさんの姿は見えない。
        voice_character_id: null
      - text: いつの間にか、ケンはひとりでミュージアムの奥へたどり着いていた。
        voice_character_id: null
      - text: （受付さんは、この先にいるのかな）
        voice_character_id: char_hero
    next_scene: scene_museum_core_default
  - id: scene_ch5_museum_after_clear
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 展示室の入口は静かになっている。奥へ続く通路から、淡い光が漏れている。
        voice_character_id: null
    next_scene: scene_museum_core_default
  - id: scene_ch5_move_to_core
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    next_scene: scene_museum_core_default
  - id: scene_museum_core_default
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch5_detective_purified
                value: true
              - flag: flag_ch5_student_purified
                value: true
              - flag: flag_ch5_sister_purified
                value: true
              - flag: flag_ch5_all_spirits_purified_seen
                value: true
                negate: true
          next_scene: scene_ch5_all_spirits_purified
        - condition:
            and:
              - flag: flag_ch5_detective_purified
                value: true
              - flag: flag_ch5_student_purified
                value: true
              - flag: flag_ch5_sister_purified
                value: true
          next_scene: scene_ch5_after_purify_center_command
        - condition:
            and:
              - flag: flag_ch5_detective_talked
                value: true
              - flag: flag_ch5_student_talked
                value: true
              - flag: flag_ch5_sister_talked
                value: true
              - flag: flag_ch5_staff_explained_spirits
                value: false
          next_scene: scene_ch5_staff_reappears
        - condition:
            flag: flag_ch5_staff_explained_spirits
            value: true
          next_scene: scene_ch5_museum_core_possessed_command
        - condition: null
          next_scene: scene_ch5_museum_core_command
  - id: scene_ch5_museum_core_command
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: ミュージアムの中心部に立っている。
        voice_character_id: null
      - text: 三つの扉が、静かにこちらを見ているみたいだ。
        voice_character_id: null
    next_scene: null
  - id: scene_ch5_museum_core_possessed_command
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 中心部の壁に、赤い光が脈のように走っている。
        voice_character_id: null
      - text: 三つの部屋の悪霊が、まだこの場所にも影を落としているみたいだ。
        voice_character_id: null
    next_scene: null
  - id: scene_museum_history_room_default
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch5_staff_explained_spirits
            value: true
            negate: true
          next_scene: scene_ch5_history_detective_first
        - condition:
            flag: flag_ch5_detective_purified
            value: true
          next_scene: scene_ch5_history_detective_after
        - condition: null
          next_scene: scene_ch5_history_detective_possessed
  - id: scene_ch5_history_detective_first
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_detective_talked
        value: true
      - flag: flag_ch5_room_history_cleared
        value: true
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 「赤羽の歴史」の部屋には、探偵がいた。
        voice_character_id: null
      - text: 「おお、ケン。ちょうどよかった。出口を推理してたんだが、どうも出口の方がこっちを避けてるんだ」
        voice_character_id: char_detective
      - text: 「探偵さんでも出られないんですか」
        voice_character_id: char_hero
      - text: 「まったく分からん。こういう時は、分からないと正直に言うのも推理のうちだ」
        voice_character_id: char_detective
      - text: 探偵は古い写真を見上げたまま、困ったように笑った。
        voice_character_id: null
      - text: （ここでも、どうにもならないみたいだ）
        voice_character_id: char_hero
      - text: 移動すれば中心部へ戻れそうだ。
        voice_character_id: null
  - id: scene_museum_portrait_room_default
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch5_staff_explained_spirits
            value: true
            negate: true
          next_scene: scene_ch5_portrait_student_first
        - condition:
            flag: flag_ch5_student_purified
            value: true
          next_scene: scene_ch5_portrait_student_after
        - condition: null
          next_scene: scene_ch5_portrait_student_possessed
  - id: scene_ch5_portrait_student_first
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_student_talked
        value: true
      - flag: flag_ch5_room_portrait_cleared
        value: true
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages:
      - text: 「人々の肖像」の部屋では、大学生が額縁の前でスマホを握りしめていた。
        voice_character_id: null
      - text: 「ケンくん！　助かった……いや、助かってないか。ここ、出口が消えるんですよ」
        voice_character_id: char_college_student
      - text: 「大学生さんも閉じ込められたんですか」
        voice_character_id: char_hero
      - text: 「そうなんです。写真を撮ろうとしただけなのに、急に部屋がぐにゃって」
        voice_character_id: char_college_student
      - text: どうすれば出られるのか、大学生にも分からないようだった。
        voice_character_id: null
      - text: （ここも、手がかりはあるけど解決はできない）
        voice_character_id: char_hero
      - text: 移動すれば中心部へ戻れそうだ。
        voice_character_id: null
  - id: scene_museum_storage_room_default
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch5_staff_explained_spirits
            value: true
            negate: true
          next_scene: scene_ch5_storage_sister_first
        - condition:
            flag: flag_ch5_sister_purified
            value: true
          next_scene: scene_ch5_storage_sister_after
        - condition: null
          next_scene: scene_ch5_storage_sister_possessed
  - id: scene_ch5_storage_sister_first
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_sister_talked
        value: true
      - flag: flag_ch5_room_storage_cleared
        value: true
    characters:
      - character_id: char_candy_sister
        position: center
        expression: normal
    messages:
      - text: 収蔵庫には、見覚えのないお姉さんがいた。
        voice_character_id: null
      - text: 「あ、よかった。人が来た……でも、出口が見つからないの」
        voice_character_id: char_candy_sister
      - text: 「大丈夫ですか」
        voice_character_id: char_hero
      - text: 「うん。弟を探してたら、ここに迷い込んじゃって。アメが好きな、ちょっとやんちゃな子なんだけど」
        voice_character_id: char_candy_sister
      - text: ケンはその弟が誰なのか、まだ気づかなかった。
        voice_character_id: null
      - text: （この人も、出られなくて困ってる）
        voice_character_id: char_hero
      - text: 移動すれば中心部へ戻れそうだ。
        voice_character_id: null
  - id: scene_ch5_staff_reappears
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_staff_explained_spirits
        value: true
    characters:
      - character_id: char_museum_staff
        position: center
        expression: normal
    messages:
      - text: 三つの部屋を回って中心部へ戻ると、床の光が集まり、人影になった。
        voice_character_id: null
      - text: 「……ケンさん」
        voice_character_id: char_museum_staff
      - text: 「受付さん！　無事だったんですね」
        voice_character_id: char_hero
      - text: 「この記憶の美術館が……悪意の影に塗りつぶされています」
        voice_character_id: char_museum_staff
      - text: 「悪霊……」
        voice_character_id: char_hero
      - text: 「三つの部屋に潜む影を払わなければ、出口は開きません。さきほどすれ違った三人は、いまごろ別の顔をしているはずです」
        voice_character_id: char_museum_staff
      - text: 「三つの部屋で、それぞれ悪霊を倒す……」
        voice_character_id: char_hero
      - text: 「はい。記憶と計算と観察力。あなたの力で、心の額縁を取り戻してください」
        voice_character_id: char_museum_staff
    next_scene: null
  - id: scene_ch5_history_detective_possessed
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: possessed
    messages:
      - text: 歴史の部屋に戻ると、探偵の体が赤く光っていた。
        voice_character_id: null
      - text: 「ふ、ふふ……数字の足跡が見えるぞ。俺の推理に勝てるか」
        voice_character_id: char_detective
      - text: 「探偵さん、悪霊に……！」
        voice_character_id: char_hero
      - text: 「勝負です。フラッシュ暗算で、悪霊を引きはがします」
        voice_character_id: char_hero
    next_engine:
      id: flash_calc
      transition: numberstorm
      config:
        difficulty: normal
        rounds: 5
      return_scene: scene_ch5_detective_battle_result
  - id: scene_ch5_detective_battle_result
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flash_calc_passed
            value: true
          next_scene: scene_ch5_detective_purified
        - condition: null
          next_scene: scene_ch5_detective_battle_retry
  - id: scene_ch5_detective_battle_retry
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: possessed
    messages:
      - text: 「まだだ。数字の霧は晴れんぞ」
        voice_character_id: char_detective
      - text: 「もう一回、やります」
        voice_character_id: char_hero
    next_scene: scene_ch5_history_detective_possessed
  - id: scene_ch5_detective_purified
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_detective_purified
        value: true
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 赤い光がほどけ、探偵はその場にへたりこんだ。
        voice_character_id: null
      - text: 「助かったぞ、ケン。悪霊というやつは数字にも弱いんだな」
        voice_character_id: char_detective
      - text: 「中心部へ戻ります」
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch5_history_detective_after
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 探偵は古い写真の前で、慎重に出口を推理している。
        voice_character_id: null
      - text: 「俺はもう大丈夫だ。ほかの部屋へ急いでくれ、ケン」
        voice_character_id: char_detective
    next_scene: null
  - id: scene_ch5_portrait_student_possessed
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: possessed
    messages:
      - text: 肖像の部屋では、大学生の体が赤く光っていた。
        voice_character_id: null
      - text: 「記憶なら負けませんよ。全部、額縁に保存してますから」
        voice_character_id: char_college_student
      - text: 「神経衰弱で、悪霊を追い出します」
        voice_character_id: char_hero
    next_engine:
      id: memory_game
      transition: cardflip
      config:
        stageId: ch5_student_spirit
        bgm: audio/bgm/mistery.mp3
        mode: duel
        pairs: 6
        opponentSkill: normal
        title: 肖像の神経衰弱
        playerCharacterId: char_hero
        opponentCharacterId: char_college_student
        opponentDialogue:
          - そこ、見ましたよ
          - 記憶の額縁に入れておきました
          - たぶん、次はこれです
        opponentMatchDialogue:
          - よし、そろった
          - 覚えてました
        opponentMissDialogue:
          - あれ、写真が動いた？
          - 記憶違いでした
      return_scene: scene_ch5_student_battle_result
  - id: scene_ch5_student_battle_result
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: memory_game_result_ch5_student_spirit
            value: win
          next_scene: scene_ch5_student_purified
        - condition: null
          next_scene: scene_ch5_student_battle_retry
  - id: scene_ch5_student_battle_retry
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: possessed
    messages:
      - text: 「まだ、肖像がこっちを見ています」
        voice_character_id: char_college_student
      - text: 「もう一回です」
        voice_character_id: char_hero
    next_scene: scene_ch5_portrait_student_possessed
  - id: scene_ch5_student_purified
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_student_purified
        value: true
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages:
      - text: 大学生を包んでいた赤い光が、額縁の中へ吸い込まれて消えた。
        voice_character_id: null
      - text: 「はあ……助かりました。今の、SNSに書いても誰も信じないですね」
        voice_character_id: char_college_student
      - text: 「無事でよかったです」
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ch5_portrait_student_after
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_college_student
        position: center
        expression: normal
    messages:
      - text: 大学生は額縁の前で、まだ少し青ざめている。
        voice_character_id: null
      - text: 「僕は大丈夫です。ほかの部屋、お願いします」
        voice_character_id: char_college_student
    next_scene: null
  - id: scene_ch5_storage_sister_possessed
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_candy_sister
        position: center
        expression: possessed
    messages:
      - text: 収蔵庫へ戻ると、お姉さんの体が赤く光っていた。
        voice_character_id: null
      - text: 「違うもの、見つけられる？　見つけられないなら、ここにしまわれちゃうよ」
        voice_character_id: char_candy_sister
      - text: 「違う絵を探せばいいんだ……」
        voice_character_id: char_hero
    next_engine:
      id: spot_difference
      transition: spotlight
      config:
        stageId: sister_spirit
        title: 収蔵庫の違う絵探し
        timeLimitMs: 35000
        targetCount: 4
        gridSize: 20
        gridColumns: 5
        cellSize: 76
        cellGap: 14
        imagePool:
          - difference/obachan01_m.png
          - difference/obachan02_m.png
      return_scene: scene_ch5_sister_battle_result
  - id: scene_ch5_sister_battle_result
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: spot_difference_result_sister_spirit
            value: win
          next_scene: scene_ch5_sister_purified
        - condition: null
          next_scene: scene_ch5_sister_battle_retry
  - id: scene_ch5_sister_battle_retry
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_candy_sister
        position: center
        expression: possessed
    messages:
      - text: 「まだ違う絵が残ってるよ」
        voice_character_id: char_candy_sister
      - text: 「次は見つけます」
        voice_character_id: char_hero
    next_scene: scene_ch5_storage_sister_possessed
  - id: scene_ch5_sister_purified
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_sister_purified
        value: true
    characters:
      - character_id: char_candy_sister
        position: center
        expression: normal
    messages:
      - text: お姉さんの体から赤い光がほどけ、アメの缶の中へ消えていった。
        voice_character_id: null
      - text: 「ありがとう。弟にも、ちゃんと迎えに行くって言わなきゃ」
        voice_character_id: char_candy_sister
      - text: 「弟さん、アメが好きなんですね」
        voice_character_id: char_hero
      - text: 「うん。ほんとに大好きなの。困ったくらい」
        voice_character_id: char_candy_sister
    next_scene: null
  - id: scene_ch5_storage_sister_after
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_candy_sister
        position: center
        expression: normal
    messages:
      - text: お姉さんは収蔵庫の扉のそばで、弟のことを心配している。
        voice_character_id: null
      - text: 「私は大丈夫。ほかの人も助けてあげて」
        voice_character_id: char_candy_sister
    next_scene: null
  - id: scene_ch5_all_spirits_purified
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_all_spirits_purified_seen
        value: true
    characters:
      - character_id: char_museum_staff
        position: center
        expression: talking
    messages:
      - text: 三つの部屋の赤い光が消えると、中心部の床に光の線が走った。
        voice_character_id: null
      - text: 線はひとつに集まり、さらに奥の扉を照らしている。
        voice_character_id: null
      - text: 「見事です。悪霊は三つとも離れました」
        voice_character_id: char_museum_staff
      - text: 「これで、みんな出られますか」
        voice_character_id: char_hero
      - text: 「はい。ですが、この奥にまだ、取りついたものの核があります」
        voice_character_id: char_museum_staff
    talkable:
      - character_id: char_museum_staff
        scene_id: scene_ch5_staff_deep_path
  - id: scene_ch5_after_purify_center_command
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_staff
        position: center
        expression: normal
    messages:
      - text: 三体の悪霊を払っても、中心部の赤い光はまだ消えていない。
        voice_character_id: null
      - text: 受付さんが、奥の扉の前で待っている。
        voice_character_id: null
    talkable:
      - character_id: char_museum_staff
        scene_id: scene_ch5_staff_deep_path
  - id: scene_ch5_staff_deep_path
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_staff
        position: center
        expression: talking
    messages:
      - text: 「三枚の額縁は、取り戻しました。……でも奥を見てください。闇がまだ、道を作っています」
        voice_character_id: char_museum_staff
      - text: 「まだ、走らないといけないんですね」
        voice_character_id: char_hero
      - text: 「その先にあるのは、すべての影の根。核を砕けば、美術館は目を覚まします」
        voice_character_id: char_museum_staff
      - text: 「行きましょう」
        voice_character_id: char_hero
    next_scene: scene_ch5_deep_run_start
  - id: scene_ch5_deep_run_start
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages:
      - text: ケンは奥へ伸びた赤い道へ飛び込んだ。
        voice_character_id: null
    next_engine:
      id: runner_action
      transition: speedline
      config:
        stageId: museum_deep_run
        mode: collect
        name: 悪霊の核へ走れ
        durationMs: 32000
        stompEnemies: true
        enemySet: deep
        lives: 3
        bgm: audio/bgm/rase.mp3
        bgmVolume: 0.24
        objectSpeedMultiplier: 1.05
        playerImage: runner/hero.png
        playerWidth: 74
        playerHeight: 104
        theme:
          sky: "#23151c"
          ground: "#32272e"
          accent: "#ff6f91"
      return_scene: scene_ch5_deep_run_result
  - id: scene_ch5_deep_run_result
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: runner_action_result_museum_deep_run
            value: complete
          next_scene: scene_ch5_deep_run_clear
        - condition: null
          next_scene: scene_ch5_deep_run_retry
  - id: scene_ch5_deep_run_retry
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages:
      - text: 赤い道に押し戻され、ケンは中心部へ転がり出た。
        voice_character_id: null
      - text: 「揺れる影に怯まないで。その道は、まだあなたを待っています」
        voice_character_id: char_museum_staff
    next_scene: scene_ch5_staff_deep_path
  - id: scene_ch5_deep_run_clear
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_deep_run_cleared
        value: true
    messages:
      - text: 揺らぐ敵を踏み越え、ケンは赤い道の奥へたどり着いた。
        voice_character_id: null
      - text: 中心部のさらに奥で、何か大きな気配がうごめいている。
        voice_character_id: null
    next_scene: scene_museum_deep_core_default
  - id: scene_museum_deep_core_default
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch5_yui_purified
                value: true
              - flag: flag_ch5_candykid_purified
                value: true
          next_scene: scene_ch5_deep_core_all_purified
        - condition: null
          next_scene: scene_ch5_deep_core_command
  - id: scene_ch5_deep_core_command
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 奥へ進んだ先にも、さっきとよく似た中心部があった。
        voice_character_id: null
      - text: ただ、赤い光はここが本当の奥だと言うみたいに、強く脈打っている。
        voice_character_id: null
      - text: 左右に、二つの部屋が口を開けている。
        voice_character_id: null
  - id: scene_museum_yui_room_default
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch5_yui_purified
            value: true
          next_scene: scene_ch5_yui_after
        - condition: null
          next_scene: scene_ch5_yui_possessed
  - id: scene_ch5_yui_possessed
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: possessed
    messages:
      - text: 部屋の奥に、ユイが立っていた。体のまわりが赤く揺れている。
        voice_character_id: null
      - text: 「ケン……違うものを見つけて。早く」
        voice_character_id: char_yui
      - text: 声はユイのものなのに、どこか遠くから聞こえた。
        voice_character_id: null
    next_engine:
      id: spot_difference
      transition: spotlight
      config:
        stageId: yui_spirit
        title: ユイの違う絵探し
        timeLimitMs: 45000
        targetCount: 5
        gridSize: 36
        gridColumns: 6
        cellSize: 62
        cellGap: 12
        imagePool:
          - difference/obachan01_m.png
          - difference/obachan02_m.png
          - difference/obachan03_m.png
          - difference/obachan04_m.png
      return_scene: scene_ch5_yui_battle_result
  - id: scene_ch5_yui_battle_result
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: spot_difference_result_yui_spirit
            value: win
          next_scene: scene_ch5_yui_purified
        - condition: null
          next_scene: scene_ch5_yui_retry
  - id: scene_ch5_yui_retry
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: possessed
    messages:
      - text: 赤い光がまた絵の中へ散った。
        voice_character_id: null
      - text: 「ケン、もう一回……」
        voice_character_id: char_yui
    next_scene: scene_ch5_yui_possessed
  - id: scene_ch5_yui_purified
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_yui_purified
        value: true
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 赤い光がユイの体から離れ、展示室の床へ溶けていった。
        voice_character_id: null
      - text: 「……ケン。来てくれて、よかった」
        voice_character_id: char_yui
      - text: 「まだ奥に何かいる。気をつけて」
        voice_character_id: char_yui
  - id: scene_ch5_yui_after
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: ユイは展示室の壁にもたれて、息を整えている。
        voice_character_id: null
      - text: 「私は大丈夫。アメ好きっ子の部屋も見て」
        voice_character_id: char_yui
    next_scene: null
  - id: scene_museum_oyaji_room_default
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch5_candykid_purified
            value: true
          next_scene: scene_ch5_candykid_after
        - condition: null
          next_scene: scene_ch5_candykid_possessed
  - id: scene_ch5_candykid_possessed
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_candy_kid
        position: center
        expression: possessed
    messages:
      - text: アメちゃんの包み紙が並ぶ展示室で、アメ好きっ子がぐるぐると走り回っていた。
        voice_character_id: null
      - text: 「アメだ！アメがある！全部食べる！全部ぼくのだ！」
        voice_character_id: char_candy_kid
      - text: 赤い光がアメ好きっ子のまわりをせわしなく回っている。目が合わない。
        voice_character_id: null
      - text: （タイミングを合わせれば、止められるかもしれない）
        voice_character_id: char_hero
    next_engine:
      id: timing_game
      transition: timing
      config:
        stageId: candy_spirit
        bgm: audio/bgm/mistery.mp3
        title: アメ好きっ子のタイミング勝負
        rounds: 6
        targetHits: 4
        cycleMs: 1650
        targetWidth: 0.2
      return_scene: scene_ch5_candykid_battle_result
  - id: scene_ch5_candykid_battle_result
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: timing_game_result_candy_spirit
            value: win
          next_scene: scene_ch5_candykid_purified
        - condition: null
          next_scene: scene_ch5_candykid_retry
  - id: scene_ch5_candykid_retry
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_candy_kid
        position: center
        expression: possessed
    messages:
      - text: 赤い光がアメ好きっ子のまわりをまた速く回りはじめた。
        voice_character_id: null
      - text: 「アメ！もっとよこせ！ぜんぶよこせ！」
        voice_character_id: char_candy_kid
    next_scene: scene_ch5_candykid_possessed
  - id: scene_ch5_candykid_purified
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_candykid_purified
        value: true
    characters:
      - character_id: char_candy_kid
        position: center
        expression: normal
    messages:
      - text: タイミングが合った瞬間、赤い光がアメ好きっ子からはじけ飛んだ。
        voice_character_id: null
      - text: 「……あれ？　ケン兄ちゃん？　なんでここにいんの」
        voice_character_id: char_candy_kid
      - text: 「悪霊に取り憑かれてたんだよ。もう大丈夫だから」
        voice_character_id: char_hero
      - text: 「取り憑かれてたの？　なんか、すごくお腹すいた……」
        voice_character_id: char_candy_kid
      - text: 「中心部へ戻ろう。まだ終わってない」
        voice_character_id: char_hero
  - id: scene_ch5_candykid_after
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_candy_kid
        position: center
        expression: normal
    messages:
      - text: アメ好きっ子は展示ケースの前で、ぼうっと包み紙を眺めている。
        voice_character_id: null
      - text: 「ぼく大丈夫。でもなんかお腹すいた……アメ食べたい」
        voice_character_id: char_candy_kid
    next_scene: null
  - id: scene_ch5_deep_core_all_purified
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: ユイとアメ好きっ子を浄化すると、奥の中心部の赤い光が一つに集まった。
        voice_character_id: null
      - text: それでも、ミュージアムのいちばん奥には、まだ細い光の道が残っている。
        voice_character_id: null
      - text: （ここまで来た。もう少しだけ、奥へ）
        voice_character_id: char_hero
    next_scene: scene_ch5_find_staff
  - id: scene_ch5_find_staff
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_staff
        position: center
        expression: normal
    messages:
      - text: 奥の細い光の道を進むと、壁際にうずくまっている人がいた。
        voice_character_id: null
      - text: 受付さんだった。
        voice_character_id: null
      - text: 「受付さん！　大丈夫ですか」
        voice_character_id: char_hero
      - text: 「……ケンさん？　来てくれたんですか」
        voice_character_id: char_museum_staff
      - text: 「館長が……急に様子がおかしくなって、私を奥に閉じ込めてしまって」
        voice_character_id: char_museum_staff
      - text: 「館長が？」
        voice_character_id: char_hero
      - text: 「ミュージアムに何かが入り込んでいるんです。館長はその奥にいる。でも今の館長は……」
        voice_character_id: char_museum_staff
      - text: 受付さんの声がふるえた。
        voice_character_id: null
      - text: 「ケンさんなら、きっと止められます。お願いします」
        voice_character_id: char_museum_staff
      - text: （館長……受付さんを助けにきたのに、こんな場所まで来てしまった）
        voice_character_id: char_hero
      - text: 「分かりました。行ってきます」
        voice_character_id: char_hero
    next_scene: scene_ch5_director_appears
  - id: scene_ch5_director_appears
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 赤い光が一点に集まったとき、ミュージアムのいちばん奥から、重く沈んだ声が響いた。
        voice_character_id: null
      - text: 「……よくぞ、ここまで来た」
        voice_character_id: char_museum_director
        characters:
          - character_id: char_museum_director
            position: center
            expression: possessed
      - text: 館長だった。足が床から浮いており、体のまわりを赤い光が激しく渦巻いている。
        voice_character_id: null
      - text: 「このミュージアムは、悪霊のものだ。子ども一人に止めることなど、できはせん」
        voice_character_id: char_museum_director
      - text: （受付さんを助けに来たのに……館長まで取り憑かれてる）
        voice_character_id: char_hero
      - text: 「来い。最後の試練を受けてみよ！」
        voice_character_id: char_museum_director
    next_scene: scene_ch5_final_run
  - id: scene_ch5_final_run
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages: []
    next_engine:
      id: runner_action
      config:
        stageId: museum_final_boss
        durationMs: 28000
        stompEnemies: true
        enemySet: boss
        lives: 4
        bgm: audio/bgm/rase.mp3
        bgmVolume: 0.26
        objectSpeedMultiplier: 1.1
        playerImage: runner/hero.png
        playerWidth: 74
        playerHeight: 104
        name: 館長との最終決戦
        bossImage: runner/kancho2.png
        bossWidth: 160
        bossHeight: 160
        bossYOffset  : 40
        theme:
          sky: "#1a0a14"
          ground: "#2e1c26"
          accent: "#ff4060"
      return_scene: scene_ch5_final_run_result
  - id: scene_ch5_final_run_result
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: runner_action_result_museum_final_boss
            value: complete
          next_scene: scene_ch5_final_run_clear
        - condition: null
          next_scene: scene_ch5_final_run_retry
  - id: scene_ch5_final_run_retry
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 悪霊の群れに押し返され、ケンは中心部へ転がり出た。
        voice_character_id: null
      - text: 「まだか……もう一度だ！」
        voice_character_id: char_museum_director
    next_scene: scene_ch5_final_run
  - id: scene_ch5_final_run_clear
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    background_effect: possessed
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch5_director_purified
        value: true
    characters: []
    messages:
      - text: 最後の悪霊を踏み越えたとき、館長の体を包む赤い光が爆ぜた。
        voice_character_id: null
      - text: 「ぐ……！　こんな子どもに……」
        voice_character_id: char_museum_director
      - text: 赤い光が消えるにつれ、館長の足がゆっくりと床に下りていく。
        voice_character_id: null
    next_scene: scene_ch5_director_awakening
  - id: scene_ch5_director_awakening
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 「……ここは。わたしは何を……」
        voice_character_id: char_museum_director
      - text: 「気を失っていたようです。あなたが助けてくれたのかね、坊や」
        voice_character_id: char_museum_director
      - text: 「はい……館長さん、大丈夫ですか」
        voice_character_id: char_hero
      - text: 「ふう。ミュージアムの悪霊を、ひとりで片付けるとは。大したものだ」
        voice_character_id: char_museum_director
      - text: ミュージアム中の赤い光が、一斉に消えた。廊下の向こうがにわかに明るくなる。
        voice_character_id: null
      - text: 「ケンさんっ！　ケンさん、無事ですか？！」
        voice_character_id: char_museum_part_timer
      - text: バイトさんが駆けてくる声がした。受付さんも一緒だった。
        voice_character_id: null
        characters:
          - character_id: char_museum_staff
            position: right
            expression: normal
      - text: 「ケンさんが来てくれたから、助かった。本当にありがとう」
        voice_character_id: char_museum_staff
      - text: （受付さんも、バイトさんも……よかった）
        voice_character_id: char_hero
      - text: ユイとアメ好きっ子も、廊下を歩いてきた。
        voice_character_id: null
        characters:
          - character_id: char_yui
            position: left
            expression: normal
          - character_id: char_museum_staff
            position: right
            expression: normal
      - text: 「ケン、終わった？」
        voice_character_id: char_yui
      - text: 「うん。終わったよ」
        voice_character_id: char_hero
    next_scene: scene_ch5_final_ending
  - id: scene_ch5_final_ending
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    bgm: audio/bgm/ending.mp3
    ending_title: 第5章　美術館の迷宮
    flags_set:
      - flag: flag_ch5_cleared
        value: true
    characters: []
    messages:
      - text: ミュージアムは、ふだんの静けさを取り戻した。
        voice_character_id: null
      - text: 壁の赤い光は消え、展示ケースは元の場所に収まり、廊下には普通の照明が灯っていた。
        voice_character_id: null
      - text: （悪霊は、全部倒した。ユイも、アメ好きっ子も、館長も、みんな助けられた）
        voice_character_id: char_hero
      - text: ケンは廊下に腰を下ろして、しばらくその感覚を味わっていた。
        voice_character_id: null
      - text: （赤羽のみんなが、一緒にいてくれた。そのおかげで、ここまで来れた）
        voice_character_id: char_hero
    game_end: true
  - id: scene_station_default
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 駅前はいつも通り人が多い。今はミュージアムへ急いだ方がよさそうだ。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_coderdojo_default
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters: []
    messages:
      - text: CoderDojoの部屋は静かだった。今日はミュージアムの異変が気になる。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_ichibangai_default
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 一番街の入口に立つ。今日は霧は出ていない。
        voice_character_id: null
    next_scene: null
  - id: scene_arcade_default
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: アーケード街はにぎやかだ。けれど、ミュージアムのことが頭から離れない。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_park_default
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 公園のベンチに風が通る。少し休んだら、団地へ戻ろう。
        voice_character_id: null
    next_scene: null
  - id: scene_slope_default
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/slope.mp3
    characters: []
    messages:
      - text: 坂の上から団地を見下ろすと、ミュージアムの窓だけが妙に明るく見えた。
        voice_character_id: null
    next_scene: null
  - id: scene_plum_park_default
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 梅の木公園は静かだ。今はここに異変はないみたいだ。
        voice_character_id: char_hero
    next_scene: null
  - id: scene_station_end_default
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 駅の端まで来た。遠くで電車の音が響いている。
        voice_character_id: null
    next_scene: null
`,f=`scenes:
  - id: scene_ch6_start
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_chapter
        value: 6
      - flag: flag_chapter1_cleared
        value: true
      - flag: flag_ch2_cleared
        value: true
      - flag: flag_ch3_cleared
        value: true
      - flag: flag_ch4_cleared
        value: true
      - flag: flag_ch5_cleared
        value: true
      - flag: flag_station_explored
        value: true
      - flag: flag_visited_slope
        value: true
      - flag: flag_ch3_museum_unlocked
        value: true
    messages:
      - text: 第6章
        voice_character_id: null
    next_scene: scene_ch6_danchi_phone

  - id: scene_ch6_danchi_phone
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    flags_set:
      - flag: flag_ch6_director_call
        value: true
    characters:
      - character_id: char_hero
        position: left
        expression: normal
    messages:
      - text: ミュージアムの迷宮が消えた、次の日の朝だった。
        voice_character_id: null
      - text: 団地の広場に出ると、ケンのスマホが小さく震えた。
        voice_character_id: null
      - text: 画面には、団地のミュージアムの番号が出ていた。
        voice_character_id: null
      - text: 「もしもし、ケンです」
        voice_character_id: char_hero
      - text: 「朝早くすまない。昨日は本当に助かった」
        voice_character_id: char_museum_director
      - text: 館長の声は落ち着いていたけれど、少しだけ硬かった。
        voice_character_id: null
      - text: 「実は、また一番街の様子がおかしい。昨日の悪霊の残りとは、比べものにならない気配がある」
        voice_character_id: char_museum_director
      - text: 「一番街……ですか」
        voice_character_id: char_hero
      - text: （また、あの場所だ）
        voice_character_id: char_hero
      - text: 「詳しい話をしたい。ミュージアムまで来られるかね」
        voice_character_id: char_museum_director
      - text: 「はい。行きます」
        voice_character_id: char_hero
    next_scene: null

  - id: scene_danchi_morning
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    characters: []
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch6_director_call
            value: true
          next_scene: null
        - condition: null
          next_scene: scene_ch6_danchi_phone

  - id: scene_museum_default
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch6_memory_hunt_started
                value: true
              - flag: flag_ch6_memory_director
                value: true
                negate: true
          next_scene: scene_ch6_museum_memory_director
        - condition:
            and:
              - flag: flag_ch6_memory_obachan
                value: true
              - flag: flag_ch6_memory_oyaji
                value: true
              - flag: flag_ch6_memory_director
                value: true
              - has_item: item_labyrinth_bookmark
                negate: true
          next_scene: scene_ch6_museum_bookmark_before_rechallenge
        - condition:
            and:
              - flag: flag_ch6_memory_hunt_started
                value: true
              - flag: flag_ch6_memory_director
                value: true
          next_scene: scene_ch6_museum_memory_after
        - condition:
            flag: flag_ch6_maze_blocked
            value: true
          next_scene: scene_ch6_museum_arcade_hint
        - condition:
            flag: flag_ch6_director_briefed
            value: true
          next_scene: scene_ch6_museum_after_briefing
        - condition: null
          next_scene: scene_ch6_museum_briefing

  - id: scene_ch6_museum_briefing
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch6_director_briefed
        value: true
    item_give:
      - item_id: item_labyrinth_bookmark
        condition: null
    characters:
      - character_id: char_museum_director
        position: center
        expression: normal
    messages:
      - text: ミュージアムのロビーには、まだ昨日の片付けの跡が残っていた。
        voice_character_id: null
      - text: 館長は展示ケースの前で、古い地図を広げて待っていた。
        voice_character_id: null
      - text: 「来てくれてありがとう。感じるかね。昨日とは、気配の向きが違う」
        voice_character_id: char_museum_director
      - text: 「一番街から来ているんですか」
        voice_character_id: char_hero
      - text: 「ああ。かつてない大きな怨霊だ。商店街そのものを、迷宮に変えようとしている」
        voice_character_id: char_museum_director
      - text: 館長は地図の端に挟んでいた、色あせたしおりを差し出した。
        voice_character_id: null
      - text: 「これは迷宮のしおりだ。迷路の中で使えば、一度外へ出られる。戻るときは、しおりを挟んだ場所から再開できる」
        voice_character_id: char_museum_director
      - text: 「そんなものが……」
        voice_character_id: char_hero
      - text: 「昨日の礼だ。君なら、使いどころを間違えない」
        voice_character_id: char_museum_director
      - text: 迷宮のしおりを受け取った。
        voice_character_id: null
      - text: 「一番街へ行く前に、仲間にも声をかけるといい。ひとりで抱えすぎないことだ」
        voice_character_id: char_museum_director
      - text: （ユイにも、知らせた方がいい）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_museum_after_briefing
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_director
        position: center
        expression: normal
    talkable:
      - character_id: char_museum_director
        scene_id: scene_ch6_talk_director
    messages: []
    branches:
      type: auto
      choices:
        - condition: null
          next_scene: null

  - id: scene_ch6_talk_director
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_labyrinth_bookmark
            negate: true
          next_scene: scene_ch6_talk_director_bookmark_refill
        - condition: null
          next_scene: scene_ch6_talk_director_bookmark_has

  - id: scene_ch6_talk_director_bookmark_refill
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    item_give:
      - item_id: item_labyrinth_bookmark
        condition: null
    characters:
      - character_id: char_museum_director
        position: center
        expression: talking
    messages:
      - text: 「迷宮のしおりを使ったのだね。あれは一度きりの道具だ」
        voice_character_id: char_museum_director
      - text: 「はい。外へ出られました。でも、消えてしまって」
        voice_character_id: char_hero
      - text: 「では、もう一枚渡しておこう。無理をせず、必要な時は戻ってきなさい」
        voice_character_id: char_museum_director
      - text: 迷宮のしおりを受け取った。
        voice_character_id: null
    next_scene: null

  - id: scene_ch6_talk_director_bookmark_has
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_director
        position: center
        expression: talking
    messages:
      - text: 「一番街の気配は、昨日の悪霊より深い。迷宮のしおりは一度使うと消える。使ったら、またここへ来なさい」
        voice_character_id: char_museum_director
      - text: 「はい。ありがとうございます」
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_museum_arcade_hint
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch6_arcade_hint
        value: true
    characters:
      - character_id: char_museum_staff
        position: left
        expression: normal
      - character_id: char_museum_part_timer
        position: right
        expression: talking
    messages:
      - text: 「迷宮が消えなかった……それに、おばちゃんが、来るなって」
        voice_character_id: char_hero
      - text: ミュージアムのロビーには、受付さんとバイトさんだけがいた。
        voice_character_id: null
      - text: 「館長さんは？」
        voice_character_id: char_hero
      - text: 「館長なら、アーケード街を見に行きました。そちらにも変な気配が出ているそうです」
        voice_character_id: char_museum_staff
      - text: 「さっき、すごく急いで出ていきました。ひとりで大丈夫かなって……」
        voice_character_id: char_museum_part_timer
      - text: 「アーケード街……」
        voice_character_id: char_hero
      - text: （おばちゃんを助ける手がかりが、そこにあるかもしれない）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_museum_memory_director
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    flags_set:
      - flag: flag_ch6_memory_director
        value: true
    item_give:
      - item_id: item_ch6_old_map_piece
        condition: null
    characters:
      - character_id: char_museum_staff
        position: left
        expression: normal
      - character_id: char_museum_part_timer
        position: right
        expression: talking
    messages:
      - text: ミュージアムのロビーでは、受付さんとバイトさんが古い展示ノートを広げていた。
        voice_character_id: null
      - text: 「館長が若いころに作った、赤羽の資料です。三十年前の事件の記録が少しだけ残っていました」
        voice_character_id: char_museum_staff
      - text: 「このページ、見てください。『入口は石ではなく、人々の記憶で開く』って書いてあります」
        voice_character_id: char_museum_part_timer
      - text: ノートの間から、古い地図の切れ端がすべり落ちた。
        voice_character_id: null
      - text: 「館長さん、これをわざと挟んでいたのかも」
        voice_character_id: char_yui
        characters:
          - character_id: char_yui
            position: center
            expression: normal
      - text: （館長さんも、三十年前の勇者の一人なんだ）
        voice_character_id: char_hero
      - text: 古い地図の切れ端を受け取った。
        voice_character_id: null
      - text: 「館長をお願いします。あの人、ひとりで危ないところへ行ってしまうので」
        voice_character_id: char_museum_staff
        characters:
          - character_id: char_museum_staff
            position: left
            expression: normal
          - character_id: char_museum_part_timer
            position: right
            expression: normal
    next_scene: null

  - id: scene_ch6_museum_memory_after
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    characters:
      - character_id: char_museum_staff
        position: left
        expression: normal
      - character_id: char_museum_part_timer
        position: right
        expression: normal
    messages:
      - text: 「館長の展示ノートは、ここで預かっています。あの地図の切れ端が、きっと手がかりになります」
        voice_character_id: char_museum_staff
      - text: 「一番街、気をつけてくださいね」
        voice_character_id: char_museum_part_timer
    next_scene: null

  - id: scene_ch6_museum_bookmark_before_rechallenge
    location_id: loc_museum
    background: backgrounds/museum.jpg
    bgm: audio/bgm/museum.mp3
    item_give:
      - item_id: item_labyrinth_bookmark
        condition: null
    characters:
      - character_id: char_museum_staff
        position: left
        expression: normal
      - character_id: char_museum_part_timer
        position: right
        expression: talking
    messages:
      - text: 三つの記憶のしるしを持ってミュージアムへ戻ると、受付さんが小さな箱を差し出した。
        voice_character_id: null
      - text: 「館長が出かける前に、予備を置いていきました。もう一度一番街へ向かう人が来たら渡してほしい、と」
        voice_character_id: char_museum_staff
      - text: 箱の中には、色あせた迷宮のしおりが一枚入っていた。
        voice_character_id: null
      - text: 「記憶のしるしがそろったなら、入口はきっと開きます。でも、無理はしないでください」
        voice_character_id: char_museum_part_timer
      - text: 迷宮のしおりを受け取った。
        voice_character_id: null
      - text: （館長さんも、ぼくたちが戻ってくることを信じていたんだ）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_coderdojo_default
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch6_ichibangai_reopened
                value: true
              - flag: flag_ch6_mentor_power_2
                value: true
          next_scene: scene_ch6_coderdojo_after_training_final
        - condition:
            and:
              - flag: flag_ch6_ichibangai_reopened
                value: true
              - flag: flag_ch6_mentor_power
                value: true
              - flag: flag_ch6_mentor_power_2
                value: true
                negate: true
              - has_item: item_ch6_hero_mark
          next_scene: scene_ch6_coderdojo_mentor_second_training
        - condition:
            and:
              - flag: flag_ch6_ichibangai_reopened
                value: true
              - flag: flag_ch6_mentor_power
                value: true
                negate: true
          next_scene: scene_ch6_coderdojo_mentor_late
        - condition:
            and:
              - flag: flag_ch6_ichibangai_reopened
                value: true
              - flag: flag_ch6_mentor_power
                value: true
          next_scene: scene_ch6_coderdojo_after_training
        - condition:
            flag: flag_ch6_coderdojo_yui_met
            value: true
          next_scene: scene_ch6_coderdojo_after_yui
        - condition:
            flag: flag_ch6_director_briefed
            value: true
          next_scene: scene_ch6_coderdojo_yui
        - condition: null
          next_scene: scene_ch6_coderdojo_quiet

  - id: scene_ch6_coderdojo_quiet
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters: []
    messages:
      - text: CoderDojoの部屋は静かだった。今日はまだ誰も来ていない。
        voice_character_id: null
    next_scene: null

  - id: scene_ch6_coderdojo_yui
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    flags_set:
      - flag: flag_ch6_coderdojo_yui_met
        value: true
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: CoderDojoのドアを開けると、いつもの机がきれいに並んでいた。
        voice_character_id: null
      - text: けれど、田中メンターの姿はない。
        voice_character_id: null
      - text: 「ケン」
        voice_character_id: char_yui
      - text: 奥の席に、ユイがひとりで座っていた。
        voice_character_id: null
      - text: 「ユイ。今日、メンター来てないの？」
        voice_character_id: char_hero
      - text: 「うん。今日は急に来られなくなったって。さっき連絡があった」
        voice_character_id: char_yui
      - text: 「そっか……」
        voice_character_id: char_hero
      - text: 「一番街のこと？」
        voice_character_id: char_yui
      - text: 「うん。館長さんが、今までで一番大きい怨霊だって」
        voice_character_id: char_hero
      - text: ユイは少しだけ黙って、それから立ち上がった。
        voice_character_id: null
      - text: 「……わかった。一緒に行く」
        voice_character_id: char_yui
      - text: 「危ないかもしれないよ」
        voice_character_id: char_hero
      - text: 「だから行く。ケンを一人にしない」
        voice_character_id: char_yui
      - text: （ユイがいる。それだけで、少し息がしやすくなる）
        voice_character_id: char_hero
    next_scene: scene_ch6_coderdojo_after_yui

  - id: scene_ch6_coderdojo_after_yui
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_coderdojo
    commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    clickable_areas:
      - id: area_ch6_coderdojo_juice
        x: 89
        "y": 394
        width: 52
        height: 70
        label: ジュース
        next_scene: scene_ch6_coderdojo_examine_juice
        condition: null
      - id: area_ch6_coderdojo_milktea
        x: 704
        "y": 390
        width: 87
        height: 69
        label: ティー
        next_scene: scene_ch6_coderdojo_examine_milktea
        condition: null
    messages: []
    branches:
      type: auto
      choices:
        - condition: null
          next_scene: null
    child_scenes:
      - id: scene_ch6_coderdojo_examine_juice
        messages: []
        branches:
          type: auto
          choices:
            - condition:
                has_item: item_drink
                negate: true
              next_scene: scene_ch6_coderdojo_juice_get
            - condition: null
              next_scene: scene_ch6_coderdojo_juice_have
        child_scenes:
          - id: scene_ch6_coderdojo_juice_get
            messages:
              - text: 机の隅に、ジュースが置いてある。
                voice_character_id: null
              - text: もらっていいかな。
                voice_character_id: char_hero
              - text: ポケットに入れた。
                voice_character_id: null
            item_give:
              - item_id: item_drink
                condition: null
            next_scene: null
          - id: scene_ch6_coderdojo_juice_have
            messages:
              - text: 机の隅にジュースがある。もう持っているからいいか。
                voice_character_id: char_hero
            next_scene: null
      - id: scene_ch6_coderdojo_examine_milktea
        messages: []
        branches:
          type: auto
          choices:
            - condition:
                has_item: item_milktea
                negate: true
              next_scene: scene_ch6_coderdojo_milktea_get
            - condition: null
              next_scene: scene_ch6_coderdojo_milktea_have
        child_scenes:
          - id: scene_ch6_coderdojo_milktea_get
            messages:
              - text: ペットボトルのミルクティーが置いてある。おいしそう。
                voice_character_id: null
              - text: ラッキー。もらっとこう。
                voice_character_id: char_hero
            item_give:
              - item_id: item_milktea
                condition: null
            next_scene: null
          - id: scene_ch6_coderdojo_milktea_have
            messages:
              - text: ミルクティーがある。もう持っているからいいか。
                voice_character_id: char_hero
            next_scene: null

  - id: scene_ch6_coderdojo_mentor_late
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
      - character_id: char_mentor
        position: right
        expression: normal
    talkable:
      - character_id: char_mentor
        scene_id: scene_ch6_talk_mentor_training
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_coderdojo_final
    commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    clickable_areas:
      - id: area_ch6_coderdojo_juice_training
        x: 89
        "y": 394
        width: 52
        height: 70
        label: ジュース
        next_scene: scene_ch6_coderdojo_examine_juice
        condition: null
      - id: area_ch6_coderdojo_milktea_training
        x: 704
        "y": 390
        width: 87
        height: 69
        label: ティー
        next_scene: scene_ch6_coderdojo_examine_milktea
        condition: null
    messages:
      - text: CoderDojoへ戻ると、田中メンターが机の前で小さく手を上げた。
        voice_character_id: null
      - text: 「ごめん、ケンちゃん。おなか痛くて遅れた」
        voice_character_id: char_mentor
      - text: 「メンター……来てたんですね」
        voice_character_id: char_hero
      - text: 「うん。顔色、ただごとじゃないね。一番街のこと、話して」
        voice_character_id: char_mentor
      - text: （最後の迷宮へ行く前に、メンターにも話しておこう）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_talk_mentor_training
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: talking
    messages:
      - text: ケンは一番街の入口が開いたこと、13階まで続く霧の迷宮のことをメンターに話した。
        voice_character_id: null
      - text: 「なるほど。今のまま突っ込むのは危ないね」
        voice_character_id: char_mentor
      - text: 「やっぱり、準備が足りないですか」
        voice_character_id: char_hero
      - text: 「足りないというより、アップデートしよう。短い修行をやる」
        voice_character_id: char_mentor
      - text: 「修行？」
        voice_character_id: char_hero
      - text: 「違う絵探し。観察力と集中力を上げる。デバッグも迷宮も、違和感に気づくところからだよ」
        voice_character_id: char_mentor
    next_engine:
      id: spot_difference
      transition: spotlight
      config:
        stageId: ch6_mentor_training
        title: メンター修行・違う絵探し
        timeLimitMs: 50000
        targetCount: 5
        gridSize: 30
        gridColumns: 6
        cellSize: 62
        cellGap: 10
        imagePool:
          - difference/mentor01.jpg
          - difference/mentor02.jpg
          - difference/mentor03.jpg
          - difference/mentor04.jpg
      return_scene: scene_ch6_mentor_training_result

  - id: scene_ch6_mentor_training_result
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: spot_difference_result_ch6_mentor_training
            value: win
          next_scene: scene_ch6_mentor_power_up
        - condition: null
          next_scene: scene_ch6_mentor_training_retry

  - id: scene_ch6_mentor_training_retry
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: talking
    messages:
      - text: 「惜しい。焦ると見えてるものも見えなくなる」
        voice_character_id: char_mentor
      - text: 「もう一回、やってみます」
        voice_character_id: char_hero
      - text: 「うん。デバッグも根気だよ」
        voice_character_id: char_mentor
    next_scene: scene_ch6_talk_mentor_training

  - id: scene_ch6_mentor_power_up
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    flags_set:
      - flag: flag_ch6_mentor_power
        value: true
    characters:
      - character_id: char_yui
        position: left
        expression: normal
      - character_id: char_mentor
        position: right
        expression: talking
    messages:
      - text: 最後の違う絵を見つけた瞬間、メンターがぱちんと指を鳴らした。
        voice_character_id: null
      - text: 「よし。メンターパワー注入」
        voice_character_id: char_mentor
      - text: 「メンターパワー……？」
        voice_character_id: char_hero
      - text: 「気持ちの問題だよ。でも、いざとなったら効く。まずは一段階、HPと攻撃と防御を底上げだ」
        voice_character_id: char_mentor
      - text: 体の奥が少し熱くなった。迷宮の霧を思い出しても、足がすくまない。
        voice_character_id: null
      - text: 「ケン、今なら行けると思う」
        voice_character_id: char_yui
      - text: 「うん。ありがとう、メンター」
        voice_character_id: char_hero
      - text: 「ただし、もっと深いところには別の鍵がいるかも。9階あたりに、勇者のしるしが眠ってるはずだよ」
        voice_character_id: char_mentor
    next_scene: scene_ch6_coderdojo_after_training

  - id: scene_ch6_coderdojo_after_training
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
      - character_id: char_mentor
        position: right
        expression: normal
    talkable:
      - character_id: char_mentor
        scene_id: scene_ch6_talk_mentor_after_training
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_coderdojo_final
    commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    clickable_areas:
      - id: area_ch6_coderdojo_juice_after_training
        x: 89
        "y": 394
        width: 52
        height: 70
        label: ジュース
        next_scene: scene_ch6_coderdojo_examine_juice
        condition: null
      - id: area_ch6_coderdojo_milktea_after_training
        x: 704
        "y": 390
        width: 87
        height: 69
        label: ティー
        next_scene: scene_ch6_coderdojo_examine_milktea
        condition: null
    messages:
      - text: CoderDojoの部屋には、メンターとユイがいる。最深迷宮の9階にある勇者のしるしを見つけたら、もう一度ここへ戻ろう。
        voice_character_id: null
    next_scene: null

  - id: scene_ch6_talk_mentor_after_training
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: talking
    messages:
      - text: 「まずは9階の宝箱を探して。勇者のしるしがあれば、もう一段階いける」
        voice_character_id: char_mentor
      - text: 「はい」
        voice_character_id: char_hero
      - text: 「それと、おなか痛い時は無理しない。これは今日の教訓」
        voice_character_id: char_mentor
    next_scene: null

  - id: scene_ch6_coderdojo_mentor_second_training
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
      - character_id: char_mentor
        position: right
        expression: talking
    messages:
      - text: 勇者のしるしを持ってCoderDojoへ戻ると、メンターがすぐに気づいた。
        voice_character_id: null
      - text: 「それだ。9階まで行けたなら、次の修行に進める」
        voice_character_id: char_mentor
      - text: 「また違う絵探しですか」
        voice_character_id: char_hero
      - text: 「うん。今度は仕上げ。見落としをゼロに近づけよう」
        voice_character_id: char_mentor
    next_engine:
      id: spot_difference
      transition: spotlight
      config:
        stageId: ch6_mentor_training_final
        title: メンター修行・勇者のしるし
        timeLimitMs: 52000
        targetCount: 6
        gridSize: 36
        gridColumns: 6
        cellSize: 62
        cellGap: 10
        imagePool:
          - difference/mentor01.jpg
          - difference/mentor02.jpg
          - difference/mentor03.jpg
          - difference/mentor04.jpg
      return_scene: scene_ch6_mentor_second_training_result

  - id: scene_ch6_mentor_second_training_result
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: spot_difference_result_ch6_mentor_training_final
            value: win
          next_scene: scene_ch6_mentor_power_up_final
        - condition: null
          next_scene: scene_ch6_mentor_second_training_retry

  - id: scene_ch6_mentor_second_training_retry
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: talking
    messages:
      - text: 「あと少し。勇者のしるしは持ってる。集中を切らさなければいけるよ」
        voice_character_id: char_mentor
      - text: 「もう一回、お願いします」
        voice_character_id: char_hero
    next_scene: scene_ch6_coderdojo_mentor_second_training

  - id: scene_ch6_mentor_power_up_final
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    flags_set:
      - flag: flag_ch6_mentor_power_2
        value: true
    characters:
      - character_id: char_yui
        position: left
        expression: normal
      - character_id: char_mentor
        position: right
        expression: talking
    messages:
      - text: 勇者のしるしが淡く光り、メンターのパソコン画面に小さな星が走った。
        voice_character_id: null
      - text: 「最終メンターパワー、入った」
        voice_character_id: char_mentor
      - text: 「今度は、さっきよりはっきり分かる」
        voice_character_id: char_hero
      - text: 「HP、攻撃、防御、全部もう一段階上がってる。これなら最深部まで戦える」
        voice_character_id: char_mentor
      - text: 「ケン、行こう。館長さんとおばちゃんを助ける」
        voice_character_id: char_yui
      - text: 「うん」
        voice_character_id: char_hero
    next_scene: scene_ch6_coderdojo_after_training_final

  - id: scene_ch6_coderdojo_after_training_final
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
      - character_id: char_mentor
        position: right
        expression: normal
    talkable:
      - character_id: char_mentor
        scene_id: scene_ch6_talk_mentor_after_training_final
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_coderdojo_final
    commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    clickable_areas:
      - id: area_ch6_coderdojo_juice_after_training_final
        x: 89
        "y": 394
        width: 52
        height: 70
        label: ジュース
        next_scene: scene_ch6_coderdojo_examine_juice
        condition: null
      - id: area_ch6_coderdojo_milktea_after_training_final
        x: 704
        "y": 390
        width: 87
        height: 69
        label: ティー
        next_scene: scene_ch6_coderdojo_examine_milktea
        condition: null
    messages:
      - text: CoderDojoの部屋には、最後の迷宮へ向かう前の静かな緊張が満ちている。
        voice_character_id: null
    next_scene: null

  - id: scene_ch6_talk_mentor_after_training_final
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_mentor
        position: center
        expression: talking
    messages:
      - text: 「ここまで準備したなら、あとは進むだけ。焦らず、一歩ずつね」
        voice_character_id: char_mentor
      - text: 「はい」
        voice_character_id: char_hero
      - text: 「デバッグも根気だよ。最後まで見届けてきて」
        voice_character_id: char_mentor
    next_scene: null

  - id: scene_ch6_talk_yui_coderdojo_final
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「メンター、間に合ってよかったね」
        voice_character_id: char_yui
      - text: 「うん。少し安心した」
        voice_character_id: char_hero
      - text: 「でも、最後は私たちで行く。ケン、準備できたら一番街へ戻ろう」
        voice_character_id: char_yui
    next_scene: null

  - id: scene_ch6_talk_yui_coderdojo
    location_id: loc_coderdojo
    background: backgrounds/coderdojo.jpg
    bgm: audio/bgm/coderdojo.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「メンターがいないのは不安だけど、館長さんのしおりがあるんでしょ」
        voice_character_id: char_yui
      - text: 「うん。迷路から出て、同じ場所から戻れるって」
        voice_character_id: char_hero
      - text: 「なら、無理しすぎないで行こう」
        voice_character_id: char_yui
    next_scene: null

  - id: scene_ichibangai_default
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch6_ichibangai_reopened
            value: true
          next_scene: scene_ch6_ichibangai_final_ready
        - condition:
            and:
              - flag: flag_ch6_memory_obachan
                value: true
              - flag: flag_ch6_memory_oyaji
                value: true
              - flag: flag_ch6_memory_director
                value: true
          next_scene: scene_ch6_ichibangai_reopen
        - condition:
            flag: flag_ch6_memory_hunt_started
            value: true
          next_scene: scene_ch6_ichibangai_memory_missing
        - condition:
            flag: flag_ch6_maze_blocked
            value: true
          next_scene: scene_ch6_ichibangai_blocked
        - condition:
            flag: flag_ch6_coderdojo_yui_met
            value: true
          next_scene: scene_ch6_ichibangai_arrival
        - condition:
            flag: flag_ch6_director_briefed
            value: true
          next_scene: scene_ch6_ichibangai_need_yui
        - condition: null
          next_scene: scene_ch6_ichibangai_quiet

  - id: scene_ch6_ichibangai_quiet
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 一番街の入口は、まだ普通の商店街に見えた。
        voice_character_id: null
      - text: でも、どこか空気が重い。先に館長の話を聞いた方がよさそうだ。
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_ichibangai_blocked
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_ichibangai_blocked
    messages:
      - text: ケンは迷宮へ戻ろうと、一番街の入口に手を伸ばした。
        voice_character_id: null
      - text: けれど、見えない壁に押し返されるように、足が止まった。
        voice_character_id: null
      - text: 「入れない……」
        voice_character_id: char_hero
      - text: 「おばちゃんの言葉が、結界みたいになってるのかも」
        voice_character_id: char_yui
      - text: （おばちゃんを助けなきゃならない。そのために、赤羽で手がかりを探すんだ）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_ichibangai_memory_missing
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_memory_hunt
    messages:
      - text: 一番街の入口には、まだ見えない壁が張りついていた。
        voice_character_id: null
      - text: ケンが近づくと、ポケットの中の古いしるしがかすかに震えた。
        voice_character_id: null
      - text: 「三人の勇者の記憶が、まだ足りないんだと思う」
        voice_character_id: char_yui
      - text: 「おばちゃん、おじさん、館長さん……三人の記憶」
        voice_character_id: char_hero
      - text: （赤羽のどこかに、まだ残っているはずだ）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_ichibangai_reopen
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    flags_set:
      - flag: flag_ch6_ichibangai_reopened
        value: true
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 一番街の入口に立つと、古い包み紙、古い切符、古い地図の切れ端が同時に光った。
        voice_character_id: null
      - text: 「そろったんだ。三人の記憶が」
        voice_character_id: char_yui
      - text: おばちゃんが誰かに渡したアメちゃん。怖くても戻ったおじさんの切符。館長が残した地図。
        voice_character_id: null
      - text: （おばちゃんは、一人じゃない）
        voice_character_id: char_hero
      - text: 「おばちゃんを覚えている人がいる。助けたい人もいる。だから、もう閉じこめられなくていい」
        voice_character_id: char_hero
      - text: 見えない壁に、細いひびが入った。
        voice_character_id: null
      - text: ひびは光になってほどけ、一番街の奥へ続く道が開いていく。
        voice_character_id: null
      - text: 「行こう。館長さんを助けて、おばちゃんを連れ戻す」
        voice_character_id: char_yui
    next_scene: scene_ch6_ichibangai_final_ready

  - id: scene_ch6_ichibangai_final_ready
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_final_maze_gate
    messages:
      - text: 一番街の入口は開いている。奥から、かすかな灯りが見えた。
        voice_character_id: null
      - text: （あれは、館長さんの灯りかもしれない）
        voice_character_id: char_hero
      - text: 「ここから先が、本当に最後だね」
        voice_character_id: char_yui
      - text: ケンは小さくうなずいた。
        voice_character_id: null
    branches:
      type: choice
      choices:
        - label: 最後の迷宮へ入る
          condition:
            has_item: item_labyrinth_bookmark
          next_scene: scene_ch6_final_maze_enter
        - label: 迷宮のしおりを取りに戻る
          condition:
            has_item: item_labyrinth_bookmark
            negate: true
          next_scene: scene_ch6_maze_no_bookmark
        - label: 少し準備してから来る
          condition: null
          next_scene: null

  - id: scene_ch6_final_maze_enter
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/fog.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 開いた入口の奥には、さっきまでの迷宮より細かな霧が満ちていた。
        voice_character_id: null
      - text: 霧は光の粒みたいに舞い、壁のひびの奥まで静かに入り込んでいる。
        voice_character_id: null
      - text: 「7階から先……13階まで、気配が沈んでる」
        voice_character_id: char_yui
      - text: 「館長さんは、その奥にいる」
        voice_character_id: char_hero
      - text: ケンは迷宮のしおりを確かめ、霧の中へ踏み出した。
        voice_character_id: null
    next_engine:
      id: maze_rpg
      transition: rift
      config:
        map: ichibangai_abyss_final_13f
        minimapMode: visited
        name: 一番街の最深迷宮
        floorLabelStart: 7
        floorLabelPrefix: ""
        boostedStatStages:
          - flag: flag_ch6_mentor_power
            stats:
              maxHp: 30
              hp: 30
              atk: 7
              def: 3
          - flag: flag_ch6_mentor_power_2
            stats:
              maxHp: 42
              hp: 42
              atk: 9
              def: 4
        bgm: audio/bgm/fog.mp3
        battleBgm: audio/bgm/buttle2.mp3
        bossBgm: audio/bgm/buttle_last.mp3
        theme:
          wallFront: "#394056"
          wallSide: "#171d2c"
          ceilTop: "#01030a"
          ceilBottom: "#07101c"
          floorTop: "#060b12"
          floorBottom: "#010203"
          uiBg: "#03060b"
          uiAccent: "#c7f1ff"
          uiBorder: "#3a5666"
          wallDamage: 0.72
          wallStain: "#1d3844"
          mistColor: "#d6f4ff"
          mistDensity: 0.42
        floorThemes:
          "1":
            wallFront: "#394056"
            wallSide: "#171d2c"
            uiAccent: "#c7f1ff"
            uiBorder: "#3a5666"
            wallDamage: 0.58
            wallStain: "#1d3844"
            mistColor: "#d6f4ff"
            mistDensity: 0.34
          "2":
            wallFront: "#344a47"
            wallSide: "#132522"
            uiAccent: "#a7ffd8"
            uiBorder: "#336658"
            wallDamage: 0.64
            wallStain: "#143d36"
            mistColor: "#c9ffe7"
            mistDensity: 0.38
          "3":
            wallFront: "#4a4256"
            wallSide: "#20172d"
            uiAccent: "#dec8ff"
            uiBorder: "#5b4777"
            wallDamage: 0.7
            wallStain: "#2e2140"
            mistColor: "#eadcff"
            mistDensity: 0.43
          "4":
            wallFront: "#514838"
            wallSide: "#261f14"
            uiAccent: "#ffe0a3"
            uiBorder: "#6a5638"
            wallDamage: 0.76
            wallStain: "#403015"
            mistColor: "#fff0c8"
            mistDensity: 0.48
          "5":
            wallFront: "#334151"
            wallSide: "#121c2a"
            uiAccent: "#a8d8ff"
            uiBorder: "#3a5876"
            wallDamage: 0.82
            wallStain: "#162e48"
            mistColor: "#d7ecff"
            mistDensity: 0.54
          "6":
            wallFront: "#40364f"
            wallSide: "#171024"
            uiAccent: "#ffc4f2"
            uiBorder: "#67476a"
            wallDamage: 0.88
            wallStain: "#351b38"
            mistColor: "#ffd7fa"
            mistDensity: 0.6
          "7":
            wallFront: "#2c303d"
            wallSide: "#0c0f18"
            uiAccent: "#f3fbff"
            uiBorder: "#6b7488"
            wallDamage: 0.95
            wallStain: "#111827"
            mistColor: "#ffffff"
            mistDensity: 0.68
        events:
          E: scene_ch6_final_maze_director_event
        bossEventKey: E
        boss:
          id: abyss_boss
          name: 怨霊王
          hp: 9999
          atk: 99
          def: 99
        weakenedBoss:
          id: abyss_boss
          name: 怨霊王
          hp: 58
          atk: 7
          def: 2
        weakenedBossFlag: flag_ch6_final_boss_weakened
        bossVictoryScene: scene_ch6_final_maze_result
        itemEffects:
          item_labyrinth_bookmark:
            escapeToNovelScene: scene_ch6_maze_escape_landing
          item_onigiri:
            healHp: full
          item_candy:
            healHp: full
          item_fushigi_candy:
            healHp: full
          item_drink:
            healHp: full
          item_milktea:
            healHp: full
          item_kinchu_hikari:
            attackEnemy: 999
          item_small_ofuda:
            attackEnemy: 18
        treasures:
          m:
            itemId: item_ch6_hero_mark
            label: 勇者のしるし
      return_scene: scene_ch6_final_maze_result
      gameover_scene: scene_ch6_final_maze_gameover
      gameover_boss_scene: scene_ch6_final_boss_first_lose

  - id: scene_ch6_final_maze_director_event
    location_id: loc_ichibangai
    background: backgrounds/inner_ichibangai_dark.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: left
        expression: normal
      - character_id: char_museum_director
        position: right
        expression: normal
    messages:
      - text: 13階の霧の奥で、人影が倒れていた。
        voice_character_id: null
      - text: 「館長さん！」
        voice_character_id: char_hero
      - text: 館長は壁にもたれ、割れたランタンを片手にかすかに息をしていた。
        voice_character_id: null
      - text: 「来てしまったか……すまない。私ひとりでは、あれを止められなかった」
        voice_character_id: char_museum_director
      - text: 「悪霊にやられたんですか」
        voice_character_id: char_hero
      - text: 「ああ。三十年前より、ずっと深く根を張っている。今のまま挑めば、勝てない」
        voice_character_id: char_museum_director
      - text: 「でも、ここまで来た。引き返せない」
        voice_character_id: char_yui
      - text: 館長はうなずこうとして、苦しそうに目を閉じた。
        voice_character_id: null
      - text: 「田村さんの声を、信じなさい。彼女はまだ、完全には呑まれていない」
        voice_character_id: char_museum_director
      - text: 霧の向こうで、今までとは違う巨大な影がゆっくり立ち上がった。
        voice_character_id: null
    next_engine:
      id: __return__
      transition: rift

  - id: scene_ch6_final_boss_first_lose
    location_id: loc_ichibangai
    background: backgrounds/inner_ichibangai_dark.jpg
    bgm: audio/bgm/dungeon.mp3
    flags_set:
      - flag: flag_ch6_final_boss_weakened
        value: true
    item_give:
      - item_id: item_small_ofuda
        condition:
          has_item: item_small_ofuda
          negate: true
      - item_id: item_fushigi_candy
        condition:
          has_item: item_fushigi_candy
          negate: true
    characters:
      - character_id: char_yui
        position: left
        expression: normal
      - character_id: char_obachan
        position: right
        expression: normal
    messages:
      - text: 怨霊王の一撃で、ケンは霧の床に膝をついた。
        voice_character_id: null
      - text: けれど、外へ弾き出されることはなかった。13階の霧が、静かに渦を巻いている。
        voice_character_id: null
      - text: 「ケン！」
        voice_character_id: char_yui
      - text: 「……だいじょうぶやで」
        voice_character_id: char_obachan
      - text: 霧の中に、おばちゃんが現れた。
        voice_character_id: null
      - text: 「おばちゃん……」
        voice_character_id: char_hero
      - text: 「怖かったねえ。でも、もうひとりで受け止めんでええよ」
        voice_character_id: char_obachan
      - text: おばちゃんが手をかざすと、怨霊王の黒い体に白いひびが走った。
        voice_character_id: null
      - text: 影の大きさが半分ほどに縮み、鋭かった爪と鎧のような霧が、ぼろぼろと崩れていく。
        voice_character_id: null
      - text: 「力を少しだけほどいたよ。あとは、ケンちゃんたちの番や」
        voice_character_id: char_obachan
      - text: おばちゃんは、ちいさなおふだと不思議なアメをケンの手に握らせた。
        voice_character_id: null
      - text: 「ふふ。アメちゃんは、こわい時に効くんだよ」
        voice_character_id: char_obachan
      - text: 「ケン、行ける？」
        voice_character_id: char_yui
      - text: 「うん。今度は、勝つ」
        voice_character_id: char_hero
    next_engine:
      id: __return__
      transition: rift

  - id: scene_ch6_final_maze_gameover
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch6_mentor_power_2
            value: true
          next_scene: scene_ch6_final_maze_gameover_powered
        - condition:
            flag: flag_ch6_mentor_power
            value: true
          next_scene: scene_ch6_final_maze_gameover_need_second_level
        - condition: null
          next_scene: scene_ch6_final_maze_gameover_need_level

  - id: scene_ch6_final_maze_gameover_need_level
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_final_gameover_level
    messages:
      - text: 霧の中で力が抜け、ケンはその場に倒れこんだ。
        voice_character_id: null
      - text: それでも迷宮の外へは出られない。細かな霧が、入口へ戻る道を隠していた。
        voice_character_id: null
      - text: 「ケン……今のままだと、ここは突破できない」
        voice_character_id: char_yui
      - text: 「どこかで、レベルを上げなきゃ……」
        voice_character_id: char_hero
    branches:
      type: choice
      choices:
        - label: いったん準備し直す
          condition: null
          next_scene: null

  - id: scene_ch6_final_maze_gameover_need_second_level
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_final_gameover_level2
    messages:
      - text: 霧の中で力が抜け、ケンはその場に倒れこんだ。
        voice_character_id: null
      - text: 「ケン、最初より進めてる。でも、まだ足りない」
        voice_character_id: char_yui
      - text: 「9階の勇者のしるし……あれを持って、もう一度メンターのところへ行こう」
        voice_character_id: char_hero
    branches:
      type: choice
      choices:
        - label: いったん準備し直す
          condition: null
          next_scene: null

  - id: scene_ch6_final_maze_gameover_powered
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_maze_retry_final
    messages:
      - text: 霧の中で力が抜け、ケンはその場に倒れこんだ。
        voice_character_id: null
      - text: 「ケン、まだ戻れる。修行で見えた道を思い出して」
        voice_character_id: char_yui
      - text: 「うん……次は、もう少し進める」
        voice_character_id: char_hero
    branches:
      type: choice
      choices:
        - label: 同じ場所から再開する
          condition: null
          next_scene: scene_ch6_maze_reenter
        - label: いったん準備し直す
          condition: null
          next_scene: null

  - id: scene_ch6_final_maze_result
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_ch6_final_boss_defeated
        value: true
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 怨霊王が消えた瞬間、13階の霧が細い糸のようにほどけていった。
        voice_character_id: null
      - text: 足元が白く光り、ケンとユイは一番街の入口へ戻っていた。
        voice_character_id: null
      - text: さっきまで黒く沈んでいたゲートの奥に、朝みたいな光が差している。
        voice_character_id: null
      - text: 「戻ってきた……本当に、終わったんだ」
        voice_character_id: char_yui
      - text: 「うん。一番街も、みんなの記憶も、ちゃんと帰ってきた」
        voice_character_id: char_hero
      - text: ケンは一番街の入口を振り返り、小さく息を吐いた。
        voice_character_id: null
      - text: 「団地へ戻ろう。きっと、みんな待ってる」
        voice_character_id: char_yui
    next_scene: scene_ch6_danchi_final_reunion

  - id: scene_ch6_danchi_final_reunion
    location_id: loc_danchi
    background: backgrounds/danchimae.jpg
    bgm: audio/bgm/danchi.mp3
    ending_title: 伝説の勇者たち
    flags_set:
      - flag: flag_ch6_cleared
        value: true
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
      - character_id: char_yui
        position: center
        expression: normal
      - character_id: char_museum_director
        position: right
        expression: normal
    messages:
      - text: 団地へ戻ると、夕方の光が住棟の壁をやわらかく染めていた。
        voice_character_id: null
      - text: ベンチのそばには、おばちゃんと館長が並んで立っていた。
        voice_character_id: null
      - text: 「ケンちゃん、おかえり。よう帰ってきたねえ」
        voice_character_id: char_obachan
      - text: 「ただいま。おばちゃんも、無事でよかった」
        voice_character_id: char_hero
      - text: 「君たちのおかげだ。三十年前の宿題を、ようやく終えられた」
        voice_character_id: char_museum_director
      - text: 「宿題って、ずいぶん長かったですね」
        voice_character_id: char_yui
      - text: 館長は少し照れたように笑い、おばちゃんはいつもの調子で小さく肩をすくめた。
        voice_character_id: null
      - text: 「長い宿題ほど、終わったあとのお茶がおいしいもんだよ」
        voice_character_id: char_obachan
      - text: そのとき、坂の方から息を切らした大学生と田中メンターが駆けてきた。
        voice_character_id: null
        characters:
          - character_id: char_mentor
            position: left
            expression: normal
          - character_id: char_college_student
            position: center
            expression: normal
          - character_id: char_yui
            position: right
            expression: normal
      - text: 「ケンちゃん、ユイ。戻ってきたね。最後までデバッグできたみたいだ」
        voice_character_id: char_mentor
      - text: 「ケンくん！　一番街の霧、消えてましたよ。ほんとに、全部終わったんですね」
        voice_character_id: char_college_student
      - text: 「うん。みんなが手伝ってくれたから」
        voice_character_id: char_hero
      - text: 「最初はグミひとつだったのに、ずいぶん遠くまで来ましたね」
        voice_character_id: char_college_student
      - text: 「赤羽って、そういう街なのかも」
        voice_character_id: char_yui
      - text: 「そう。小さな違和感に気づいて、小さな勇気を積み重ねる。いいプログラムも、いい街も同じだよ」
        voice_character_id: char_mentor
      - text: 「ケン兄ちゃん！」
        voice_character_id: char_candy_kid
        characters:
          - character_id: char_candy_kid
            position: left
            expression: normal
          - character_id: char_candy_sister
            position: center
            expression: normal
          - character_id: char_obachan
            position: right
            expression: normal
      - text: アメ好きっ子とお姉さんが、手を振りながら団地の広場へ飛び込んできた。
        voice_character_id: null
      - text: 「一番街、もう怖くない？　じゃあアメちゃん大会、またできる？」
        voice_character_id: char_candy_kid
      - text: 「まずは片づけからね。でも……また笑って集まれるなら、きっと大丈夫」
        voice_character_id: char_candy_sister
      - text: 「ふふ。アメちゃんを愛する子は、ほんまはええ子や」
        voice_character_id: char_obachan
      - text: 「その言葉、記憶の額縁に飾っておきましょう」
        voice_character_id: char_museum_staff
        characters:
          - character_id: char_museum_staff
            position: left
            expression: normal
          - character_id: char_museum_part_timer
            position: center
            expression: normal
          - character_id: char_museum_director
            position: right
            expression: normal
      - text: ミュージアムの受付とバイトも、館長の後ろで深く頭を下げた。
        voice_character_id: null
      - text: 「みなさん、本当にお疲れさまでした。私、財布も鍵も今日はなくしてません！」
        voice_character_id: char_museum_part_timer
      - text: 「それは何よりだ。展示より先に、まず日常が戻ってきた」
        voice_character_id: char_museum_director
      - text: 「おや、日常が戻ったと聞いて駆けつけたぞ」
        voice_character_id: char_detective
        characters:
          - character_id: char_detective
            position: left
            expression: normal
          - character_id: char_priest
            position: center
            expression: normal
          - character_id: char_oyaji
            position: right
            expression: normal
      - text: 探偵は胸を張って現れたが、足元の小石につまずいて、神父さんにそっと支えられた。
        voice_character_id: null
      - text: 「……これは現場確認だ。転んだわけではない」
        voice_character_id: char_detective
      - text: 「足跡が増えるほど、街は強くなるものです」
        voice_character_id: char_priest
      - text: 「ガハハ、普通が一番じゃ。転ぶくらい普通、普通」
        voice_character_id: char_oyaji
      - text: みんなの笑い声が、団地の広場に広がっていった。
        voice_character_id: null
        characters:
          - character_id: char_obachan
            position: left
            expression: normal
          - character_id: char_yui
            position: center
            expression: normal
          - character_id: char_museum_director
            position: right
            expression: normal
      - text: ケンは団地の空を見上げた。いつもの夕焼けなのに、少しだけ新しく見えた。
        voice_character_id: null
      - text: 「ケン、また明日も赤羽を歩こう」
        voice_character_id: char_yui
      - text: 「うん。今度は、普通の一日を」
        voice_character_id: char_hero
      - text: 「普通が一番だ。けれど、君たちなら、その普通をちゃんと守っていける」
        voice_character_id: char_museum_director
      - text: 「さあ、帰ろうか。今日のアメちゃんは、特別に甘いやつだよ」
        voice_character_id: char_obachan
      - text: （グミも、アメちゃんも、しおりも、おふだも。全部、誰かとつながるための小さなきっかけだったんだ）
        voice_character_id: char_hero
      - text: ケンは笑ってうなずいた。赤羽の一日は、みんなの声と一緒に、また明日へ続いていく。
        voice_character_id: null
    game_end: true

  - id: scene_ch6_ichibangai_need_yui
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters: []
    messages:
      - text: 一番街のゲートの向こうから、冷たい風が吹き出していた。
        voice_character_id: null
      - text: （ひとりで入るのは、違う気がする）
        voice_character_id: char_hero
      - text: ユイに声をかけてから来よう。
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_ichibangai_arrival
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    flags_set:
      - flag: flag_ch6_maze_seen
        value: true
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: ユイと二人で一番街の入口に立った。
        voice_character_id: null
      - text: いつものアーケードは、もう見えなかった。
        voice_character_id: null
      - text: ゲートの奥に、黒い壁が何重にも折り重なっている。
        voice_character_id: null
      - text: それは建物ではなく、巨大な迷宮だった。
        voice_character_id: null
      - text: 「……口を開けてるみたい」
        voice_character_id: char_yui
      - text: 「うん」
        voice_character_id: char_hero
      - text: 迷宮の奥から、低い息のような音がした。
        voice_character_id: null
      - text: （館長さんの言っていた、大きな怨霊……この奥にいる）
        voice_character_id: char_hero
    next_scene: scene_ch6_ichibangai_challenge

  - id: scene_ch6_ichibangai_challenge
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_maze_gate
    messages:
      - text: 「怖かったら少し休んでもいいよ。ケンが決めて」
        voice_character_id: char_yui
    branches:
      type: choice
      choices:
        - label: 迷宮へ入る
          condition:
            has_item: item_labyrinth_bookmark
          next_scene: scene_ch6_maze_enter
        - label: 迷宮のしおりを取りに戻る
          condition:
            has_item: item_labyrinth_bookmark
            negate: true
          next_scene: scene_ch6_maze_no_bookmark
        - label: 少し準備してから来る
          condition: null
          next_scene: null

  - id: scene_ch6_talk_yui_maze_gate
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「メンターがいないなら、私たちでやるしかない」
        voice_character_id: char_yui
      - text: 「うん。無理はしないで行こう」
        voice_character_id: char_hero
      - text: 「迷宮のしおり、忘れないでね」
        voice_character_id: char_yui
    next_scene: scene_ch6_ichibangai_challenge

  - id: scene_ch6_talk_yui_final_maze_gate
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「ここから先が、ほんとうに最後だね」
        voice_character_id: char_yui
      - text: 「うん。館長さんも、おばちゃんも助けよう」
        voice_character_id: char_hero
      - text: 「迷宮のしおり、忘れないでね」
        voice_character_id: char_yui
    next_scene: scene_ch6_ichibangai_final_ready

  - id: scene_ch6_maze_no_bookmark
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 「待って。館長さんにもらった道具、持ってる？」
        voice_character_id: char_yui
      - text: 「迷宮のしおり……まだ受け取ってない」
        voice_character_id: char_hero
      - text: 「先にミュージアムへ戻ろう。今回は、準備なしで入っちゃだめ」
        voice_character_id: char_yui
    next_scene: null

  - id: scene_ch6_maze_enter
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 「行こう」
        voice_character_id: char_hero
      - text: 「うん。一緒に行く」
        voice_character_id: char_yui
      - text: ケンは迷宮のしおりをポケットに確かめ、黒い入口へ足を踏み入れた。
        voice_character_id: null
    next_engine:
      id: maze_rpg
      transition: rift
      config:
        map: ichibangai_abyss_5f
        minimapMode: visited
        name: 一番街の巨大迷宮
        bgm: audio/bgm/dungeon.mp3
        battleBgm: audio/bgm/buttle.mp3
        theme:
          wallFront: "#4a324e"
          wallSide: "#24152d"
          ceilTop: "#03000a"
          ceilBottom: "#12051f"
          floorTop: "#09030f"
          floorBottom: "#020105"
          uiBg: "#05020a"
          uiAccent: "#d7b3ff"
          uiBorder: "#53306f"
          wallDamage: 0.25
          wallStain: "#1d1026"
        floorThemes:
          "1":
            wallFront: "#4a324e"
            wallSide: "#24152d"
            ceilTop: "#03000a"
            ceilBottom: "#12051f"
            floorTop: "#09030f"
            floorBottom: "#020105"
            uiAccent: "#d7b3ff"
            uiBorder: "#53306f"
            wallDamage: 0.22
            wallStain: "#1d1026"
          "2":
            wallFront: "#31465a"
            wallSide: "#142838"
            ceilTop: "#020914"
            ceilBottom: "#071927"
            floorTop: "#071218"
            floorBottom: "#020608"
            uiAccent: "#9fd8ff"
            uiBorder: "#315b75"
            wallDamage: 0.34
            wallStain: "#0f3540"
          "3":
            wallFront: "#3c5137"
            wallSide: "#1d2f20"
            ceilTop: "#031006"
            ceilBottom: "#0d1c0e"
            floorTop: "#071309"
            floorBottom: "#020602"
            uiAccent: "#b7e58d"
            uiBorder: "#426432"
            wallDamage: 0.48
            wallStain: "#254017"
          "4":
            wallFront: "#5a4032"
            wallSide: "#2c1b14"
            ceilTop: "#130604"
            ceilBottom: "#24100a"
            floorTop: "#160906"
            floorBottom: "#060201"
            uiAccent: "#ffb878"
            uiBorder: "#744a32"
            wallDamage: 0.64
            wallStain: "#3a160d"
          "5":
            wallFront: "#3a334a"
            wallSide: "#18142a"
            ceilTop: "#01020a"
            ceilBottom: "#080716"
            floorTop: "#05040d"
            floorBottom: "#010104"
            uiAccent: "#f3edf8"
            uiBorder: "#675d88"
            wallDamage: 0.82
            wallStain: "#0b0818"
        events:
          E: scene_ch6_maze_event_heartbeat
        seals:
          red:
            switchTile: r
            doorTile: R
            label: 赤い霊符
          green:
            switchTile: g
            doorTile: G
            label: 緑の霊符
          purple:
            switchTile: p
            doorTile: P
            label: 紫の霊符
        treasures:
          n:
            itemId: item_onigiri
            label: お握り
          h:
            itemId: item_kinchu_hikari
            label: 悪霊退散のおふだ
        itemEffects:
          item_labyrinth_bookmark:
            escapeToNovelScene: scene_ch6_maze_escape_landing
          item_onigiri:
            healHp: full
          item_candy:
            healHp: full
          item_fushigi_candy:
            healHp: full
          item_drink:
            healHp: full
          item_milktea:
            healHp: full
          item_kinchu_hikari:
            attackEnemy: 999
          item_small_ofuda:
            attackEnemy: 18
        bossVictoryScene: scene_ch6_maze_result
      return_scene: scene_ch6_maze_result
      gameover_scene: scene_ch6_maze_gameover
      gameover_boss_scene: scene_ch6_boss_gameover
      gameover_landing_scene: scene_ichibangai_default

  - id: scene_ch6_maze_event_heartbeat
    location_id: loc_ichibangai
    background: backgrounds/inner_ichibangai_dark.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: 迷宮の壁の向こうで、どくん、と大きな音がした。
        voice_character_id: null
      - text: 「今の……心臓みたいだった」
        voice_character_id: char_yui
      - text: 「この迷宮、ただの道じゃないんだ」
        voice_character_id: char_hero
      - text: 足元の影がゆっくりほどけ、また道の形に戻っていく。
        voice_character_id: null
    next_engine:
      id: __return__
      transition: rift

  - id: scene_ch6_maze_escape_landing
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_maze_escape_landing
    messages:
      - text: 迷宮のしおりが淡く光り、景色が外のゲート前に戻った。
        voice_character_id: null
      - text: 「戻れた……」
        voice_character_id: char_hero
      - text: 「息を整えよう。道は消えてない」
        voice_character_id: char_yui
    branches:
      type: choice
      choices:
        - label: 同じ場所から再開する
          condition: null
          next_scene: scene_ch6_maze_resume
        - label: 少し準備してから戻る
          condition: null
          next_scene: null

  - id: scene_ch6_maze_resume
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    messages: []
    next_engine:
      id: __return__
      transition: rift

  - id: scene_ch6_talk_yui_maze_escape_landing
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「しおりの場所、ちゃんと残ってるみたい」
        voice_character_id: char_yui
      - text: 「ここで息を整えたら、同じ場所から戻れる」
        voice_character_id: char_yui
      - text: 「うん。準備して、もう一回行こう」
        voice_character_id: char_hero
    next_scene: scene_ch6_maze_escape_landing

  - id: scene_ch6_talk_yui_maze_retry
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「道は少し分かった。次は、あそこより先に行ける」
        voice_character_id: char_yui
      - text: 「うん。やってみる」
        voice_character_id: char_hero
    next_scene: scene_ch6_maze_gameover

  - id: scene_ch6_talk_yui_maze_retry_final
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「修行で見えた道を思い出して。まだ戻れる」
        voice_character_id: char_yui
      - text: 「うん。次は、もっと先へ行く」
        voice_character_id: char_hero
    next_scene: scene_ch6_final_maze_gameover_powered

  - id: scene_ch6_talk_yui_maze_retry_boss
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「ボスの動き、少し分かった。次はきっと近づける」
        voice_character_id: char_yui
      - text: 「うん。しおりで休みながら、もう一回行こう」
        voice_character_id: char_hero
    next_scene: scene_ch6_boss_gameover

  - id: scene_ch6_talk_yui_memory_hunt
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「三人の記憶が、まだ足りない」
        voice_character_id: char_yui
      - text: 「おばちゃん、おじさん、館長さん……赤羽のどこかにある」
        voice_character_id: char_yui
    next_scene: null

  - id: scene_ch6_talk_yui_ichibangai_blocked
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「おばちゃんの言葉が、守りになってる」
        voice_character_id: char_yui
      - text: 「三人の記憶を集めれば、解けるかもしれない」
        voice_character_id: char_yui
    next_scene: null

  - id: scene_ch6_talk_yui_final_gameover_level
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「CoderDojoのメンター……来てるかも」
        voice_character_id: char_yui
      - text: 「うん、会いに行ってみる」
        voice_character_id: char_hero
    next_scene: scene_ch6_final_maze_gameover_need_level

  - id: scene_ch6_talk_yui_final_gameover_level2
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: talking
    messages:
      - text: 「9階のしるし……メンターに見せたら、もっと力になれると思う」
        voice_character_id: char_yui
      - text: 「うん。もう一回メンターのところへ行く」
        voice_character_id: char_hero
    next_scene: scene_ch6_final_maze_gameover_need_second_level

  - id: scene_ch6_maze_gameover
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_maze_retry
    messages:
      - text: 迷宮の外へ、強い風に押し戻された。
        voice_character_id: null
      - text: 「ケン……戻ってきた。よかった」
        voice_character_id: char_yui
      - text: 「ごめん。奥まで行けなかった」
        voice_character_id: char_hero
      - text: 「大丈夫。道は少し分かった。もう一回行こう」
        voice_character_id: char_yui
    branches:
      type: choice
      choices:
        - label: もう一回入る
          condition: null
          next_scene: scene_ch6_maze_reenter
        - label: 少し準備してから来る
          condition: null
          next_scene: null

  - id: scene_ch6_boss_gameover
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    talkable:
      - character_id: char_yui
        scene_id: scene_ch6_talk_yui_maze_retry_boss
    messages:
      - text: 迷宮の奥から、黒い風に弾き出された。
        voice_character_id: null
      - text: 「ボス、強かった。でも、あと少しだった」
        voice_character_id: char_yui
      - text: 「うん。次は、しおりで休みながら行く」
        voice_character_id: char_hero
    branches:
      type: choice
      choices:
        - label: 同じ場所から再開する
          condition: null
          next_scene: scene_ch6_maze_reenter
        - label: 少し準備してから来る
          condition: null
          next_scene: null

  - id: scene_ch6_maze_reenter
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/dungeon.mp3
    messages: []
    next_engine:
      id: __return__
      transition: rift

  - id: scene_ch6_maze_result
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_ch6_maze_boss_defeated
        value: true
      - flag: flag_ch6_maze_blocked
        value: true
    characters:
      - character_id: char_yui
        position: left
        expression: normal
      - character_id: char_oyaji
        position: right
        expression: normal
    messages:
      - text: 5階の奥で巨大な怨霊を倒すと、迷宮の壁が低くうなった。
        voice_character_id: null
      - text: その場に、おじさんがぼんやりと立っていた。
        voice_character_id: null
      - text: 「おじさん……？」
        voice_character_id: char_hero
      - text: 「おお、ケンちゃんか。ここは……普通じゃないな。普通じゃない一番街は、ろくなことにならん」
        voice_character_id: char_oyaji
      - text: おじさんの声はいつもの調子なのに、目だけがどこか遠くを見ていた。
        voice_character_id: null
      - text: 「迷宮、消えない」
        voice_character_id: char_yui
      - text: いつもなら、怨霊を倒したあと迷宮はほどけていく。けれど黒い壁は、まだ一番街の奥で口を開けていた。
        voice_character_id: null
      - text: 「まだ、奥に何かあるんだ」
        voice_character_id: char_hero
      - text: ケンがもう一歩踏み出そうとした、そのとき。
        voice_character_id: null
      - text: 「これ以上は危険だよ」
        voice_character_id: char_obachan
        characters:
          - character_id: char_obachan
            position: center
            expression: normal
      - text: おばちゃんが、迷宮の黒い入口の前に立っていた。
        voice_character_id: null
      - text: 「来てはならない。ケンちゃん、ここから先へ来てはならないよ」
        voice_character_id: char_obachan
      - text: 「おばちゃん……？　なんで、そんなこと言うの」
        voice_character_id: char_hero
      - text: ケンの大好きなおばちゃんの声なのに、その言葉だけが冷たく胸に残った。
        voice_character_id: null
      - text: まばたきをした次の瞬間、おばちゃんの姿は消えていた。
        voice_character_id: null
        characters:
          - character_id: char_yui
            position: center
            expression: normal
      - text: 「ケン。今の、おばちゃんだよね」
        voice_character_id: char_yui
      - text: 「うん。でも……おばちゃんじゃないみたいだった」
        voice_character_id: char_hero
      - text: （助けなきゃ。何が起きているのか、赤羽で手がかりを集めないと）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_use_labyrinth_bookmark
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 迷宮のしおりは、迷宮の中でだけ力を発揮するみたいだ。
        voice_character_id: char_hero
    next_scene: null

  - id: scene_use_onigiri
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    item_remove:
      - item_onigiri
    messages:
      - text: お握りを食べると、迷宮でこわばっていた体が少し楽になった。
        voice_character_id: null
      - text: （よし……もう少し進めそうだ）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_use_candy
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    item_remove:
      - item_candy
    messages:
      - text: アメちゃんを口に入れると、少しだけ気持ちが落ち着いた。
        voice_character_id: null
      - text: （うん。まだ行ける）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_use_small_ofuda
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: ちいさなおふだは、迷宮の中で使った方がよさそうだ。
        voice_character_id: char_hero
    next_scene: null

  - id: scene_use_kinchu_hikari
    location_id: loc_ichibangai
    background: backgrounds/ichibangai_gate.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 悪霊退散のおふだは、強い怨霊に向けて使うものみたいだ。
        voice_character_id: char_hero
    next_scene: null

  - id: scene_station_default
    location_id: loc_station
    background: backgrounds/akabane.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 駅前はいつも通り人が多い。一番街の方角だけ、空気が少し重く感じる。
        voice_character_id: char_hero
    next_scene: null

  - id: scene_arcade_default
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: flag_ch6_past_revealed
            value: true
          next_scene: scene_ch6_arcade_after_past
        - condition:
            flag: runner_action_result_ch6_obachan_arcade_chase
            value: win
          next_scene: scene_ch6_arcade_chase_win
        - condition:
            flag: flag_ch6_arcade_hint
            value: true
          next_scene: scene_ch6_arcade_obachan_strange
        - condition: null
          next_scene: scene_ch6_arcade_quiet

  - id: scene_ch6_arcade_quiet
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: アーケード街はにぎやかだ。今は一番街の異変を優先しよう。
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_arcade_obachan_strange
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_obachan
        position: center
        expression: normal
    messages:
      - text: アーケード街に入ると、照明がひとつずつ暗く瞬いた。
        voice_character_id: null
      - text: 通りの奥で、おばちゃんがこちらに背を向けて立っていた。
        voice_character_id: null
      - text: 「おばちゃん……？」
        voice_character_id: char_hero
      - text: 「ケンちゃん。ここへ来たらあかんよ」
        voice_character_id: char_obachan
      - text: おばちゃんの足もとから、黒い影が細く伸びた。
        voice_character_id: null
      - text: 「ケン、下がって」
        voice_character_id: char_yui
        characters:
          - character_id: char_yui
            position: left
            expression: normal
          - character_id: char_obachan
            position: right
            expression: normal
      - text: おばちゃんは振り返らないまま、ふらりとアーケードの奥へ歩き出した。
        voice_character_id: null
      - text: 次の瞬間、その歩みが走る速さに変わった。
        voice_character_id: null
      - text: 「追いかけよう。あれは、いつものおばちゃんじゃない」
        voice_character_id: char_hero
    next_scene: scene_ch6_arcade_chase_start

  - id: scene_ch6_arcade_chase_start
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/dungeon.mp3
    messages:
      - text: おばちゃんの姿を見失わないよう、アーケード街を走り抜けよう。
        voice_character_id: null
    next_engine:
      id: runner_action
      transition: speedline
      config:
        stageId: ch6_obachan_arcade_chase
        mode: chase
        name: おばちゃんを追いかけろ！
        durationMs: 26000
        bgm: audio/bgm/rase.mp3
        bgmVolume: 0.24
        backgroundImage: runner/arcade_loop.jpg
        backgroundLoopWidth: 1352
        playerImage: runner/hero.png
        playerWidth: 74
        playerHeight: 104
        opponentImage: runner/obachan.png
        opponentWidth: 86
        opponentHeight: 130
        opponentYOffset: -8
        chaseStartDistance: 100
        chaseCatchRate: 0.0048
        chaseHitDistancePenalty: 12
        objectSpeedMultiplier: 1.05
        theme:
          sky: "#110914"
          ground: "#261820"
          accent: "#ffb35c"
      return_scene: scene_ch6_arcade_chase_result

  - id: scene_ch6_arcade_chase_result
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/dungeon.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            flag: runner_action_result_ch6_obachan_arcade_chase
            value: win
          next_scene: scene_ch6_arcade_chase_win
        - condition: null
          next_scene: scene_ch6_arcade_chase_retry

  - id: scene_ch6_arcade_chase_retry
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/dungeon.mp3
    characters:
      - character_id: char_yui
        position: center
        expression: normal
    messages:
      - text: おばちゃんの影は、アーケードの奥へすり抜けていった。
        voice_character_id: null
      - text: 「まだ追える。もう一回行こう」
        voice_character_id: char_yui
    next_scene: scene_ch6_arcade_chase_start

  - id: scene_ch6_arcade_chase_win
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_ch6_past_revealed
        value: true
      - flag: flag_ch6_memory_hunt_started
        value: true
    characters:
      - character_id: char_obachan
        position: left
        expression: normal
    messages:
      - text: アーケード街を抜けた先で、ケンはようやくおばちゃんに追いついた。
        voice_character_id: null
      - text: 「ケンちゃん……」
        voice_character_id: char_obachan
      - text: そこへ、柱の影からおじさんがふらりと姿を見せた。
        voice_character_id: null
        characters:
          - character_id: char_obachan
            position: left
            expression: normal
          - character_id: char_oyaji
            position: right
            expression: normal
      - text: 「やっぱり、ここまで来よったか」
        voice_character_id: char_oyaji
      - text: 「おじさん……何か知ってるんですか」
        voice_character_id: char_hero
      - text: おじさんはいつものように笑おうとして、うまく笑えなかった。
        voice_character_id: null
      - text: 「三十年前じゃ。赤羽が悪霊に襲われたことがあった」
        voice_character_id: char_oyaji
      - text: 「その時、赤羽を救ったのは……わしと、田村のおばちゃんと、館長じゃった」
        voice_character_id: char_oyaji
      - text: 「三人で？」
        voice_character_id: char_hero
      - text: 「ふふ。若いころは、みんな無茶をするもんだよ」
        voice_character_id: char_obachan
      - text: おばちゃんの声は優しいのに、黒い影がその輪郭をゆらゆらと歪ませていた。
        voice_character_id: null
      - text: 「三十年ぶりに、あの悪霊が戻ってきたんやね」
        voice_character_id: char_obachan
      - text: 「わたしはこの一週間、ずっと一番街に閉じ込められていたんだよ」
        voice_character_id: char_obachan
      - text: 「誰も気づいてくれなくて……少し、寂しかったねえ」
        voice_character_id: char_obachan
      - text: 「そんな……」
        voice_character_id: char_hero
      - text: （ぼくが見ていたおばちゃんは、本当のおばちゃんだったのかな。それとも、悪霊が見せた影だったのかな）
        voice_character_id: char_hero
      - text: 「館長さんも、勇者の一人だったの？」
        voice_character_id: char_yui
        characters:
          - character_id: char_yui
            position: left
            expression: normal
          - character_id: char_obachan
            position: center
            expression: normal
          - character_id: char_oyaji
            position: right
            expression: normal
      - text: 「そうじゃ。あいつは昔から、危ないところへ一人で行く癖がある」
        voice_character_id: char_oyaji
      - text: 「おそらく館長は、もう一番街へ向かった。今の一番街に一人で入るのは危険じゃ」
        voice_character_id: char_oyaji
      - text: 「でも、今は入れない。おばちゃんの言葉で、入口が閉じてる」
        voice_character_id: char_hero
      - text: 「閉じたなら、開ける方法もあるはずだよ。赤羽は、そういう街だからねえ」
        voice_character_id: char_obachan
      - text: おばちゃんの姿が、また黒い影の向こうへ薄れていく。
        voice_character_id: null
      - text: 「ケンちゃん……来てはならない。でも、助けに来てほしい。変なことを言って、ごめんね」
        voice_character_id: char_obachan
      - text: 「おばちゃん！」
        voice_character_id: char_hero
      - text: 次の瞬間、おばちゃんの姿はアーケードの影に消えた。
        voice_character_id: null
        characters:
          - character_id: char_yui
            position: center
            expression: normal
      - text: 「一番街に入る方法を突き止めよう。館長さんも、おばちゃんも助けないと」
        voice_character_id: char_yui
      - text: 「うん。もう一度、赤羽を調べよう」
        voice_character_id: char_hero
    next_scene: null

  - id: scene_ch6_arcade_after_past
    location_id: loc_arcade
    background: backgrounds/archade.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: アーケード街には、さっきまでのおばちゃんの声がまだ残っている気がした。
        voice_character_id: null
      - text: （一番街に入る方法を見つけて、館長さんとおばちゃんを助けるんだ）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_park_default
    location_id: loc_park
    background: backgrounds/park.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch6_memory_hunt_started
                value: true
              - flag: flag_ch6_memory_obachan
                value: true
                negate: true
          next_scene: scene_ch6_park_memory_obachan
        - condition:
            has_item: item_candy
          next_scene: scene_ch6_park_candy_kid_has
        - condition: null
          next_scene: scene_ch6_park_candy_kid_get
    child_scenes:
      - id: scene_ch6_park_memory_obachan
        flags_set:
          - flag: flag_ch6_memory_obachan
            value: true
        item_give:
          - item_id: item_ch6_old_candy_wrapper
            condition: null
        characters:
          - character_id: char_candy_kid
            position: center
            expression: normal
        messages:
          - text: 公園のベンチのそばで、アメ好きっ子が古い包み紙を大事そうに伸ばしていた。
            voice_character_id: null
          - text: 「あ、ケン兄ちゃん。これ、田村のおばちゃんのアメちゃんの包み紙なんだ」
            voice_character_id: char_candy_kid
          - text: 「昔、泣いてた子におばちゃんがくれたやつなんだって。ぼく、家でずっと聞いてた」
            voice_character_id: char_candy_kid
          - text: 「おばちゃん、知らない子にも『だいじょうぶやで』ってアメちゃんくれるんだって」
            voice_character_id: char_candy_kid
          - text: （おばちゃんは、三十年前からずっと、誰かを助けていたんだ）
            voice_character_id: char_hero
          - text: 「ケン兄ちゃんが持ってて。おばちゃんに会えたら、ぼくもありがとうって言ってたって伝えて」
            voice_character_id: char_candy_kid
          - text: 古いアメちゃんの包み紙を受け取った。
            voice_character_id: null
        talkable:
          - character_id: char_candy_kid
            scene_id: scene_park_default
        next_scene: null
      - id: scene_ch6_park_candy_kid_get
        characters:
          - character_id: char_candy_kid
            position: center
            expression: normal
        messages:
          - text: 公園のベンチのそばで、アメ好きっ子が包み紙を並べていた。
            voice_character_id: null
          - text: 「あ、ケン兄ちゃん！一番街、また変なんだって？」
            voice_character_id: char_candy_kid
          - text: 「これあげる。アメちゃんは、こわい時に効くんだ」
            voice_character_id: char_candy_kid
          - text: ケンはアメちゃんを受け取った。
            voice_character_id: null
        item_give:
          - item_id: item_candy
            condition: null
        talkable:
          - character_id: char_candy_kid
            scene_id: scene_park_default
        next_scene: null
      - id: scene_ch6_park_candy_kid_has
        characters:
          - character_id: char_candy_kid
            position: center
            expression: normal
        messages:
          - text: アメ好きっ子は、ケンのポケットをちらっと見た。
            voice_character_id: null
          - text: 「まだ持ってるじゃん。食べたらまたあげるよ」
            voice_character_id: char_candy_kid
        talkable:
          - character_id: char_candy_kid
            scene_id: scene_park_default
        next_scene: null

  - id: scene_slope_default
    location_id: loc_slope
    background: backgrounds/slope_day.jpg
    bgm: audio/bgm/slope.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            has_item: item_small_ofuda
          next_scene: scene_ch6_slope_college_has
        - condition: null
          next_scene: scene_ch6_slope_college_get
    child_scenes:
      - id: scene_ch6_slope_college_get
        characters:
          - character_id: char_college_student
            position: center
            expression: normal
        messages:
          - text: 坂の途中で、大学生が一番街の方を見上げていた。
            voice_character_id: null
          - text: 「ケンくん、これ持って行ってください。小さいけど、お守り代わりにはなると思います」
            voice_character_id: char_college_student
          - text: 大学生は、手のひらに収まるほどのちいさなおふだを渡してくれた。
            voice_character_id: null
          - text: 「ありがとうございます」
            voice_character_id: char_hero
        item_give:
          - item_id: item_small_ofuda
            condition: null
        talkable:
          - character_id: char_college_student
            scene_id: scene_slope_default
        next_scene: null
      - id: scene_ch6_slope_college_has
        characters:
          - character_id: char_college_student
            position: center
            expression: normal
        messages:
          - text: 坂の上から見る一番街の方角だけ、空の色が少し暗い。
            voice_character_id: null
          - text: 「気をつけてください。あのおふだ、使いどころがあるはずです」
            voice_character_id: char_college_student
        talkable:
          - character_id: char_college_student
            scene_id: scene_slope_default
        next_scene: null

  - id: scene_plum_park_default
    location_id: loc_plum_park
    background: backgrounds/umenoki_park.jpg
    bgm: audio/bgm/station.mp3
    characters: []
    messages:
      - text: 梅の木公園は静かだ。今はここに異変はないみたいだ。
        voice_character_id: char_hero
    next_scene: null

  - id: scene_station_end_default
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    messages: []
    branches:
      type: auto
      choices:
        - condition:
            and:
              - flag: flag_ch6_memory_hunt_started
                value: true
              - flag: flag_ch6_memory_oyaji
                value: true
                negate: true
          next_scene: scene_ch6_station_end_memory_oyaji
        - condition: null
          next_scene: scene_ch6_station_end_detective

  - id: scene_ch6_station_end_detective
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 駅の端まで来た。遠くで電車の音が響いている。
        voice_character_id: null
      - text: 赤羽の探偵が、柱の影で腕を組んでいた。
        voice_character_id: null
      - text: 「俺は今、見張り中だ。主に、何を見張っているかを考えている」
        voice_character_id: char_detective
    talkable:
      - character_id: char_detective
        scene_id: scene_ch6_talk_detective_station_end
    next_scene: null

  - id: scene_ch6_station_end_memory_oyaji
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    flags_set:
      - flag: flag_ch6_memory_oyaji
        value: true
    item_give:
      - item_id: item_ch6_old_ticket
        condition: null
    characters:
      - character_id: char_detective
        position: left
        expression: normal
      - character_id: char_oyaji
        position: right
        expression: normal
    messages:
      - text: 駅の端で、赤羽の探偵が古い切符を指先でつまんでいた。
        voice_character_id: null
      - text: 「現場保存だ。つまり、落とし物を拾って、まだ届けていない」
        voice_character_id: char_detective
      - text: 「それは……わしのじゃな」
        voice_character_id: char_oyaji
      - text: 柱の向こうから、おじさんが少し照れくさそうに出てきた。
        voice_character_id: null
      - text: 「三十年前、わしは一度逃げた。怖かったんじゃ。赤羽なんか救えんと思った」
        voice_character_id: char_oyaji
      - text: 「でも、戻ったんですね」
        voice_character_id: char_hero
      - text: 「戻った。怖いまま戻った。それだけじゃ」
        voice_character_id: char_oyaji
      - text: 探偵は大きくうなずき、切符をケンへ渡した。
        voice_character_id: null
      - text: 「勇気とは、たぶんそういうやつだ。俺も切符をなくした時は、駅員へ戻る勇気を出す。たまに」
        voice_character_id: char_detective
      - text: 古い切符を受け取った。
        voice_character_id: null
    next_scene: null

  - id: scene_ch6_talk_detective_station_end
    location_id: loc_station_end
    background: backgrounds/ekihaji.jpg
    bgm: audio/bgm/station.mp3
    characters:
      - character_id: char_detective
        position: center
        expression: normal
    messages:
      - text: 「迷宮に効きそうなもの、持ってませんか」
        voice_character_id: char_hero
      - text: 「持っていたら、今ごろ俺が迷宮を解決している。たぶん」
        voice_character_id: char_detective
      - text: 探偵は胸を張ったが、すぐに少しだけ目をそらした。
        voice_character_id: null
      - text: 「情報ならある。駅の端は、風が冷たい」
        voice_character_id: char_detective
      - text: （それは情報なのかな……）
        voice_character_id: char_hero
    next_scene: null

  - id: scene_museum_core_default
    location_id: loc_museum_core
    background: backgrounds/center_musium.png
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: ミュージアムの中心部は、昨日の静けさを取り戻している。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_history_room_default
    location_id: loc_museum_history_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 赤羽の古い写真が、静かに展示されている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_portrait_room_default
    location_id: loc_museum_portrait_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 肖像の部屋は静かだ。今日は誰も取り憑かれていない。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_storage_room_default
    location_id: loc_museum_storage_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 収蔵庫の棚は、きちんと元の場所に戻っている。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_deep_core_default
    location_id: loc_museum_deep_core
    background: backgrounds/center_musium.png
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 奥の中心部に、昨日の赤い光は残っていない。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_yui_room_default
    location_id: loc_museum_yui_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: 記憶の展示室には、小さな絵が静かに並んでいる。
        voice_character_id: null
    next_scene: null

  - id: scene_museum_oyaji_room_default
    location_id: loc_museum_oyaji_room
    background: backgrounds/musium_room01.jpg
    bgm: audio/bgm/museum.mp3
    characters: []
    messages:
      - text: アメちゃん展示室は、甘い紙の匂いが少し残っている。
        voice_character_id: null
    next_scene: null
`,p=`flags:
  - id: flag_hero_name
    type: string
    default: "ケン"
    description: "主人公の名前"

  - id: flag_left_danchi
    type: boolean
    default: false
    description: "団地を出た（初回出発済み）"

  - id: flag_station_explored
    type: boolean
    default: false
    description: "駅前の掲示板を見た（CoderDojo行き解禁条件）"

  - id: flag_got_flyer
    type: boolean
    default: false
    description: "CoderDojoのチラシを手に入れた"

  - id: flag_met_yui
    type: boolean
    default: false
    description: "友達のユイと合流した"

  - id: flag_arrived_coderdojo
    type: boolean
    default: false
    description: "CoderDojo赤羽に到着した"

  - id: flag_met_mentor
    type: boolean
    default: false
    description: "田中メンターに話しかけた"

  - id: flag_examined_whiteboard
    type: boolean
    default: false
    description: "CoderDojoのホワイトボードを調べた"

  - id: flag_examined_kids
    type: boolean
    default: false
    description: "CoderDojoの子供たちを調べた"

  - id: flag_visited_slope
    type: boolean
    default: false
    description: "団地への坂を初回訪問済み"

  - id: flag_met_college_student
    type: boolean
    default: false
    description: "坂で大学生と話した"

  - id: flag_yui_told_gummy
    type: boolean
    default: false
    description: "ユイからグミはおばちゃんが持っていると聞いた"

  - id: flag_chapter
    type: integer
    default: 1
    description: "現在のチャプター番号"

  - id: flag_chapter1_cleared
    type: boolean
    default: false
    description: "第1章クリア済み（グミエンディング到達）"

  - id: flag_ch2_cleared
    type: boolean
    default: false
    description: "第2章クリア済み"

  - id: flag_ch3_cleared
    type: boolean
    default: false
    description: "第3章クリア済み"

  - id: flag_maze_defeated
    type: boolean
    default: false
    description: "迷路で一度でも全滅した"

  - id: flag_boss_challenged
    type: boolean
    default: false
    description: "ボス（迷宮の主）に一度でも敗北した"

  - id: flag_maze_return_yui_seen
    type: boolean
    default: false
    description: "迷路敗北後に一番街へ戻った直後のユイ会話を見た"

  - id: flag_boss_return_yui_seen
    type: boolean
    default: false
    description: "ボス敗北後に一番街へ戻った直後のユイ会話を見た"

  - id: flag_ch3_helping_obachan
    type: boolean
    default: false
    description: "おばちゃんのためにチケットを探すことになった"

  - id: flag_ch3_museum_unlocked
    type: boolean
    default: false
    description: "団地のミュージアムの場所を知った（大学生から情報入手）"

  - id: flag_ch3_got_ticket
    type: boolean
    default: false
    description: "アメちゃんイベントのチケットを入手した"

  - id: flag_ch3_ticket_given
    type: boolean
    default: false
    description: "おばちゃんにチケットを渡した"

  - id: flag_ch3_ticket_stolen
    type: boolean
    default: false
    description: "アーケード街でアメ好きっ子にチケットを奪われた"

  - id: flag_ch3_ticket_recovered
    type: boolean
    default: false
    description: "公園でアメ好きっ子からチケットを取り返した"

  - id: flag_ch3_ticket_given_to_bad_kids
    type: boolean
    default: false
    description: "おばちゃんがアメ好きっ子にチケットを譲った"

  - id: flag_ch3_second_ticket_got
    type: boolean
    default: false
    description: "公園イベント後に美術館員から再度チケットを入手した"

  - id: flag_ch3_second_ticket_given_to_obachan
    type: boolean
    default: false
    description: "再取得したチケットをアーケード街でおばちゃんに渡した"

  - id: flag_ch4_obachan_knee_heard
    type: boolean
    default: false
    description: "おばちゃんの膝の痛みと来年の大会への不安を聞いた"

  - id: flag_ch4_gummy_quest
    type: boolean
    default: false
    description: "七つのグミ集めクエストを開始した（坂で大学生から伝説を聞いた）"

  - id: flag_ch4_met_detective
    type: boolean
    default: false
    description: "駅の端の探偵おやじに会った"

  - id: flag_ch4_detective_clue1
    type: boolean
    default: false
    description: "探偵の依頼の手がかり①：大学生から子猫の目撃情報を聞いた"

  - id: flag_ch4_detective_clue2
    type: boolean
    default: false
    description: "探偵の依頼の手がかり②：おばちゃんから猫は梅の木公園へ行ったと聞いた"

  - id: flag_ch4_detective_clue3
    type: boolean
    default: false
    description: "探偵の依頼の手がかり③：梅の木公園のバイトから猫は駅へ行ったと聞いた"

  - id: flag_ch4_detective_clue4
    type: boolean
    default: false
    description: "探偵の依頼の手がかり④：駅の大学生から猫は赤羽公園へ行ったと聞いた"

  - id: flag_ch4_detective_solved
    type: boolean
    default: false
    description: "探偵の依頼を解決した"

  - id: flag_ch4_museum_duel_won
    type: boolean
    default: false
    description: "4章ミュージアム神経衰弱（duel）で勝利した"

  - id: flag_ch4_plum_park_unlocked
    type: boolean
    default: false
    description: "第4章で梅の木公園へ行けるようになった"

  - id: flag_ch4_maze_appeared
    type: boolean
    default: false
    description: "第4章で一番街の迷路が出現した（おじさんの飲みすぎによる）"

  - id: flag_ch4_yui_maze_met
    type: boolean
    default: false
    description: "ユイが迷路の前に現れて初回の説明を済ませた"

  - id: flag_ch4_wallet_found
    type: boolean
    default: false
    description: "赤羽公園のベンチ下で財布を発見した（重複取得防止）"

  - id: flag_ch4_cleared
    type: boolean
    default: false
    description: "第4章クリア済み"

  - id: flag_ch5_museum_alarm
    type: boolean
    default: false
    description: "第5章でミュージアムの異変を聞いた"

  - id: flag_ch5_action_cleared
    type: boolean
    default: false
    description: "第5章のミュージアム横スクロール入口を突破した"

  - id: flag_ch5_room_history_cleared
    type: boolean
    default: false
    description: "第5章ミュージアム中心部の歴史の部屋を調べた"

  - id: flag_ch5_room_portrait_cleared
    type: boolean
    default: false
    description: "第5章ミュージアム中心部の肖像の部屋を調べた"

  - id: flag_ch5_room_storage_cleared
    type: boolean
    default: false
    description: "第5章ミュージアム中心部の収蔵庫を調べた"

  - id: flag_ch5_detective_talked
    type: boolean
    default: false
    description: "第5章で探偵と初回会話した"

  - id: flag_ch5_student_talked
    type: boolean
    default: false
    description: "第5章で大学生と初回会話した"

  - id: flag_ch5_sister_talked
    type: boolean
    default: false
    description: "第5章でお姉さんと初回会話した"

  - id: flag_ch5_staff_explained_spirits
    type: boolean
    default: false
    description: "第5章で受付から悪霊と三部屋の説明を聞いた"

  - id: flag_ch5_detective_purified
    type: boolean
    default: false
    description: "第5章で探偵に取りついた悪霊を払った"

  - id: flag_ch5_student_purified
    type: boolean
    default: false
    description: "第5章で大学生に取りついた悪霊を払った"

  - id: flag_ch5_sister_purified
    type: boolean
    default: false
    description: "第5章でお姉さんに取りついた悪霊を払った"

  - id: flag_ch5_all_spirits_purified_seen
    type: boolean
    default: false
    description: "第5章で三体浄化後の中心部イベントを見た"

  - id: flag_ch5_deep_run_cleared
    type: boolean
    default: false
    description: "第5章の中心部奥へ続くランゲームを突破した"

  - id: flag_ch5_yui_purified
    type: boolean
    default: false
    description: "第5章奥エリアでユイに取りついた悪霊を払った"

  - id: flag_ch5_candykid_purified
    type: boolean
    default: false
    description: "第5章奥エリアでアメ好きっ子に取りついた悪霊を払った"

  - id: spot_difference_result_sister_spirit
    type: string
    default: ""
    description: "第5章お姉さん悪霊戦の違う絵探し結果"

  - id: spot_difference_result_yui_spirit
    type: string
    default: ""
    description: "第5章ユイ悪霊戦の違う絵探し結果"

  - id: spot_difference_result_ch6_mentor_training
    type: string
    default: ""
    description: "第6章メンター修行1回目の違う絵探し結果"

  - id: spot_difference_result_ch6_mentor_training_final
    type: string
    default: ""
    description: "第6章メンター修行2回目の違う絵探し結果"

  - id: timing_game_result_candy_spirit
    type: string
    default: ""
    description: "第5章アメ好きっ子悪霊戦のタイミングゲーム結果"

  - id: flag_ch5_director_purified
    type: boolean
    default: false
    description: "館長の悪霊が浄化された"

  - id: runner_action_result_museum_final_boss
    type: string
    default: ""
    description: "第5章館長ボス戦のランナー結果"

  - id: flag_ch5_cleared
    type: boolean
    default: false
    description: "第5章クリア済み"

  - id: flag_ch6_director_call
    type: boolean
    default: false
    description: "第6章で館長から一番街の異変を聞いた"

  - id: flag_ch6_director_briefed
    type: boolean
    default: false
    description: "第6章で館長から一番街の怨霊と迷宮のしおりの説明を聞いた"

  - id: flag_ch6_coderdojo_yui_met
    type: boolean
    default: false
    description: "第6章でCoderDojoのユイと合流した"

  - id: flag_ch6_maze_seen
    type: boolean
    default: false
    description: "第6章で一番街の巨大迷宮を見た"

  - id: flag_ch6_maze_boss_defeated
    type: boolean
    default: false
    description: "第6章で5階の巨大迷宮ボスを倒した"

  - id: flag_ch6_maze_blocked
    type: boolean
    default: false
    description: "第6章でおばちゃんに迷宮への再突入を止められた"

  - id: flag_ch6_arcade_hint
    type: boolean
    default: false
    description: "第6章で受付とバイトからアーケード街の異変を聞いた"

  - id: flag_ch6_past_revealed
    type: boolean
    default: false
    description: "第6章で30年前の赤羽と三人の勇者の話を聞いた"

  - id: flag_ch6_memory_hunt_started
    type: boolean
    default: false
    description: "第6章後半で三人の勇者の記憶集めを開始した"

  - id: flag_ch6_memory_obachan
    type: boolean
    default: false
    description: "第6章でおばちゃんの記憶のしるしを得た"

  - id: flag_ch6_memory_oyaji
    type: boolean
    default: false
    description: "第6章でおじさんの記憶のしるしを得た"

  - id: flag_ch6_memory_director
    type: boolean
    default: false
    description: "第6章で館長の記憶のしるしを得た"

  - id: flag_ch6_ichibangai_reopened
    type: boolean
    default: false
    description: "第6章で三人の記憶により一番街入口を再び開いた"

  - id: flag_ch6_final_boss_weakened
    type: boolean
    default: false
    description: "第6章最終ボス初戦敗北後、おばちゃんの力でボスが弱体化した"

  - id: flag_ch6_final_boss_defeated
    type: boolean
    default: false
    description: "第6章で一番街最深部のボスを倒した"

  - id: flag_ch6_mentor_power
    type: boolean
    default: false
    description: "第6章で田中メンターの修行1回目に勝ち、主人公が一段階レベルアップした"

  - id: flag_ch6_mentor_power_2
    type: boolean
    default: false
    description: "第6章で勇者のしるしを持って田中メンターの修行2回目に勝ち、主人公が最終段階までレベルアップした"

  - id: flag_ch6_cleared
    type: boolean
    default: false
    description: "第6章クリア済み"
`,m=`items:
  - id: item_suica
    name: "Suicaカード"
    description: "電車に乗るためのICカード。残高はある。"
    icon: items/suica.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_flyer
    name: "CoderDojoのチラシ"
    description: "CoderDojo赤羽のチラシ。「本日開催！午後1時より」と書いてある。"
    icon: items/coderdojo_flyer.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_candy
    name: "アメちゃん"
    description: "田村のおばあさんにもらったアメ。甘くておいしい。"
    icon: items/candy.svg
    usable: true
    use_scene: scene_use_candy
    use_condition: null
    stackable: false
    category: consumable
  - id: item_drink
    name: "ジュース"
    description: "置いてあったジュース。冷たくておいしい。"
    icon: items/drink.svg
    usable: true
    use_scene: scene_use_juice
    use_condition: null
    stackable: false
    category: consumable

  - id: item_milktea
    name: "ミルクティー"
    description: "CoderDojoの机に置いてあったミルクティー。まだ温かい。"
    icon: items/milktea.svg
    usable: true
    use_scene: scene_use_milktea
    use_condition: null
    stackable: false
    category: consumable

  - id: item_fushigi_candy
    name: "不思議なアメ"
    description: "暗い迷路の中で、どこからか現れたアメ。ひんやりしているのに甘い。"
    icon: items/fushigi_candy.svg
    usable: true
    use_scene: scene_use_fushigi_candy
    use_condition: null
    stackable: false
    category: consumable

  - id: item_onigiri
    name: "お握り"
    description: "迷宮の宝箱から見つけたお握り。食べると力が戻ってくる。"
    icon: items/onigiri.svg
    usable: true
    use_scene: scene_use_onigiri
    use_condition: null
    stackable: false
    category: consumable

  - id: item_kinchu_hikari
    name: "悪霊退散のおふだ"
    description: "田中メンターから受け取った御札。かすかに光を帯びていて、迷宮の番人に大ダメージを与えられるらしい。"
    icon: items/ofuda_glow.svg
    usable: true
    use_scene: scene_use_kinchu_hikari
    use_condition: null
    stackable: false
    category: key_item

  - id: item_small_ofuda
    name: "ちいさなおふだ"
    description: "坂で大学生からもらった小さなおふだ。迷宮の怨霊に少し強い一撃を与えられる。"
    icon: items/ofuda_small.svg
    usable: true
    use_scene: scene_use_small_ofuda
    use_condition: null
    stackable: false
    category: consumable

  - id: item_labyrinth_bookmark
    name: "迷宮のしおり"
    description: "館長から受け取った古いしおり。迷宮から一度脱出し、同じ場所から再開できる。"
    icon: items/labyrinth_bookmark.svg
    usable: true
    use_scene: scene_use_labyrinth_bookmark
    use_condition: null
    stackable: false
    category: key_item

  - id: item_ch6_old_candy_wrapper
    name: "古いアメちゃんの包み紙"
    description: "アメ好きっ子が大事にしていた包み紙。おばちゃんの記憶のしるし。"
    icon: items/old_candy_wrapper.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_ch6_old_ticket
    name: "古い切符"
    description: "三十年前、おじさんが怖いまま戻った日の切符。おじさんの記憶のしるし。"
    icon: items/old_ticket.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_ch6_old_map_piece
    name: "古い地図の切れ端"
    description: "館長の展示ノートに挟まれていた地図。館長の記憶のしるし。"
    icon: items/old_map_piece.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_ch6_hero_mark
    name: "勇者のしるし"
    description: "一番街の最深迷宮9階の宝箱に入っていたしるし。さらに強くなる修行に必要。"
    icon: items/hero_mark.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_gummy
    name: "新発売のグミ"
    description: "おばちゃんのポケットから出てきたグミ。大学生が探していたやつだ。"
    icon: items/gummy_new.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_gummy_1
    name: "坂のグミ"
    description: "大学生にもらったグミ。七つ集めると願いが叶うらしい。（1/7）"
    icon: items/gummy_1.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_gummy_2
    name: "少年のグミ"
    description: "少年にアメちゃんと交換してもらったグミ。（2/7）"
    icon: items/gummy_2.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_gummy_3
    name: "計算のグミ"
    description: "ミュージアムの受付との勝負で勝ってもらったグミ。（3/7）"
    icon: items/gummy_3.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_gummy_4
    name: "謎解きのグミ"
    description: "探偵おやじの依頼を解決してもらったグミ。（4/7）"
    icon: items/gummy_4.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_wallet
    name: "バイトの財布"
    description: "赤羽公園のベンチの下で見つかった財布。梅の木公園のバイトが探していたものだ。"
    icon: items/wallet.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_gummy_5
    name: "お礼のグミ"
    description: "梅の木公園のバイトの子にお礼としてもらったグミ。（5/7）"
    icon: items/gummy_5.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_gummy_6
    name: "迷宮のグミ"
    description: "一番街の迷路チャレンジをクリアしてもらったグミ。（6/7）"
    icon: items/gummy_6.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_gummy_7
    name: "おばちゃんのグミ"
    description: "田村のおばちゃんがずっと持っていたグミ。これで七つ揃った。（7/7）"
    icon: items/gummy_7.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item

  - id: item_event_ticket
    name: "アメちゃんゲットのチケット"
    description: "アーケード街で開かれるアメちゃんゲットゲームのイベントチケット。手書きで番号が入っている。"
    icon: items/event_ticket.svg
    usable: false
    use_scene: null
    use_condition: null
    stackable: false
    category: key_item
`,h=`locations:
  - id: loc_danchi
    name: "赤羽団地"
    description: "ケンが住んでいる団地。昔からの住棟が並んでいる。"
    background_default: backgrounds/danchi_day.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_station
        label: "赤羽駅前へ"
        condition:
          flag: flag_chapter
          value: 5
          negate: true
      - location_id: loc_slope
        label: "団地への坂へ"
        condition:
          and:
            - or:
                - flag: flag_visited_slope
                  value: true
                - flag: flag_chapter
                  value: 4
            - flag: flag_chapter
              value: 5
              negate: true
      - location_id: loc_museum
        label: "団地のミュージアムへ"
        condition:
          flag: flag_ch3_museum_unlocked
          value: true
      - location_id: loc_plum_park
        label: "梅の木公園へ"
        condition:
          flag: flag_ch4_detective_clue2
          value: true
    entry_scene: scene_danchi_morning

  - id: loc_station
    name: "赤羽駅前"
    description: "JR赤羽駅の改札前。商店街への入り口でもある。"
    background_default: backgrounds/station_day.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_danchi
        label: "団地へ戻る"
        condition: null
      - location_id: loc_ichibangai
        label: "一番街入口へ"
        condition:
          flag: flag_chapter
          value: 3
          negate: true
      - location_id: loc_arcade
        label: "アーケード街へ"
        condition:
          or:
            - flag: flag_chapter
              value: 3
            - flag: flag_chapter
              value: 4
            - flag: flag_ch6_arcade_hint
              value: true
      - location_id: loc_coderdojo
        label: "CoderDojo赤羽へ"
        condition:
          flag: flag_station_explored
          value: true
      - location_id: loc_slope
        label: "団地への坂へ"
        condition:
          flag: flag_chapter
          value: 4
      - location_id: loc_slope
        label: "団地への坂へ"
        condition:
          flag: flag_chapter
          value: 6
      - location_id: loc_station_end
        label: "駅の端へ"
        condition:
          or:
            - has_item: item_gummy_2
            - flag: flag_chapter
              value: 6
      - location_id: loc_park
        label: "赤羽公園へ"
        condition:
          or:
            - flag: flag_ch4_detective_clue4
              value: true
            - flag: flag_chapter
              value: 6
    entry_scene: scene_station_default

  - id: loc_coderdojo
    name: "CoderDojo赤羽"
    description: "子どもたちが毎月集まってプログラミングを楽しむ場所。"
    background_default: backgrounds/coderdojo.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_station
        label: "駅前へ戻る"
        condition: null
      - location_id: loc_slope
        label: "団地への坂へ"
        condition:
          or:
            - and:
                - flag: flag_met_mentor
                  value: true
                - flag: flag_examined_whiteboard
                  value: true
                - flag: flag_examined_kids
                  value: true
            - flag: flag_chapter
              value: 4
            - flag: flag_chapter
              value: 6
    entry_scene: scene_coderdojo_default

  - id: loc_ichibangai
    name: "一番街入口"
    description: "赤羽一番街商店街への入り口。昔ながらのアーケードが続く。"
    background_default: backgrounds/ichibangai.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_station
        label: "駅前へ戻る"
        condition: null
    entry_scene: scene_ichibangai_default

  - id: loc_arcade
    name: "アーケード街"
    description: "駅前から続く古いアーケード街。昼でも照明がちらつき、通りの奥が見えない。"
    background_default: backgrounds/intersection.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_station
        label: "駅前へ戻る"
        condition: null
      - location_id: loc_park
        label: "公園へ"
        condition:
          or:
            - flag: flag_ch3_ticket_stolen
              value: true
            - flag: flag_chapter
              value: 4
            - flag: flag_ch6_arcade_hint
              value: true
    entry_scene: scene_arcade_default

  - id: loc_park
    name: "赤羽公園"
    description: "駅前から少し歩いたところにある公園。ベンチと遊具のまわりに子どもたちの声が響く。"
    background_default: backgrounds/danchimae.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_arcade
        label: "アーケード街へ戻る"
        condition:
          or:
            - flag: flag_ch3_ticket_stolen
              value: true
              negate: true
            - flag: flag_ch3_ticket_recovered
              value: true
      - location_id: loc_station
        label: "駅前へ"
        condition:
          or:
            - flag: flag_ch3_ticket_stolen
              value: true
              negate: true
            - flag: flag_ch3_ticket_recovered
              value: true
    entry_scene: scene_park_default

  - id: loc_museum
    name: "団地のミュージアム"
    description: "団地の一角にある小さなミュージアム。地域の歴史が展示されている。"
    background_default: backgrounds/coderdojo.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_danchi
        label: "団地へ戻る"
        condition: null
    entry_scene: scene_museum_default

  - id: loc_museum_core
    name: "ミュージアム中心部"
    description: "三つの展示室へ続く円形ホール。床に淡い光の線が走っている。"
    background_default: backgrounds/center_musium.png
    default_commands:
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_museum_history_room
        label: "「赤羽の歴史」の部屋へ"
        condition:
          flag: flag_chapter
          value: 5
      - location_id: loc_museum_portrait_room
        label: "「人々の肖像」の部屋へ"
        condition:
          flag: flag_chapter
          value: 5
      - location_id: loc_museum_storage_room
        label: "「収蔵庫」の部屋へ"
        condition:
          flag: flag_chapter
          value: 5
    entry_scene: scene_museum_core_default

  - id: loc_museum_history_room
    name: "赤羽の歴史の部屋"
    description: "赤羽の古い写真や年表が並ぶ展示室。"
    background_default: backgrounds/musium_room01.jpg
    default_commands:
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_museum_core
        label: "中心部へ戻る"
        condition:
          flag: flag_chapter
          value: 5
    entry_scene: scene_museum_history_room_default

  - id: loc_museum_portrait_room
    name: "人々の肖像の部屋"
    description: "赤羽に暮らしてきた人々の肖像が並ぶ展示室。"
    background_default: backgrounds/musium_room01.jpg
    default_commands:
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_museum_core
        label: "中心部へ戻る"
        condition:
          flag: flag_chapter
          value: 5
    entry_scene: scene_museum_portrait_room_default

  - id: loc_museum_storage_room
    name: "収蔵庫"
    description: "展示されていない品物が静かにしまわれている部屋。"
    background_default: backgrounds/musium_room01.jpg
    default_commands:
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_museum_core
        label: "中心部へ戻る"
        condition:
          flag: flag_chapter
          value: 5
    entry_scene: scene_museum_storage_room_default

  - id: loc_museum_deep_core
    name: "ミュージアム奥の中心部"
    description: "入口側とよく似た円形ホール。壁の赤い光は、前よりも濃く脈打っている。"
    background_default: backgrounds/center_musium.png
    default_commands:
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_museum_yui_room
        label: "「記憶の展示室」へ"
        condition:
          flag: flag_chapter
          value: 5
      - location_id: loc_museum_oyaji_room
        label: "「アメちゃん展示室」へ"
        condition:
          flag: flag_chapter
          value: 5
    entry_scene: scene_museum_deep_core_default

  - id: loc_museum_yui_room
    name: "記憶の展示室"
    description: "小さな絵が壁一面に並ぶ、静かな展示室。"
    background_default: backgrounds/musium_room01.jpg
    default_commands:
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_museum_deep_core
        label: "奥の中心部へ戻る"
        condition:
          flag: flag_chapter
          value: 5
    entry_scene: scene_museum_yui_room_default

  - id: loc_museum_oyaji_room
    name: "アメちゃん展示室"
    description: "懐かしいアメ菓子の包み紙や道具が並ぶ展示室。床の赤い光が妙に速い。"
    background_default: backgrounds/musium_room01.jpg
    default_commands:
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_museum_deep_core
        label: "奥の中心部へ戻る"
        condition:
          flag: flag_chapter
          value: 5
    entry_scene: scene_museum_oyaji_room_default

  - id: loc_slope
    name: "団地への坂"
    description: "CoderDojoから団地へ続く緩やかな坂道。赤羽の街が見渡せる。"
    background_default: backgrounds/slope_day.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_coderdojo
        label: "CoderDojoへ戻る"
        condition: null
      - location_id: loc_station
        label: "駅前へ下る"
        condition:
          or:
            - flag: flag_chapter
              value: 4
            - flag: flag_chapter
              value: 6
      - location_id: loc_danchi
        label: "団地へ上る"
        condition: null
    entry_scene: scene_slope_default

  - id: loc_plum_park
    name: "梅の木公園"
    description: "団地の脇にある小さな公園。古い梅の木が一本だけ立っている。"
    background_default: backgrounds/umenoki_park.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_danchi
        label: "団地へ戻る"
        condition: null
    entry_scene: scene_plum_park_default

  - id: loc_station_end
    name: "駅の端"
    description: "赤羽駅のホームの端。人が少なく、ひっそりしている。"
    background_default: backgrounds/ekihaji.jpg
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:
      - location_id: loc_station
        label: "駅前へ戻る"
        condition: null
    entry_scene: scene_station_end_default
`,g=`characters:
  - id: char_hero
    name: "ケン"
    name_flag: flag_hero_name
    voicevox_speaker_id: 2
    y_offset: -250
    sprites:
      normal: characters/hero/hero_normal.png
      happy: characters/hero/happy.png
      sad: characters/hero/sad.png
      talking: characters/hero/hero_talking.png

  - id: char_yui
    name: "ユイ"
    name_flag: null
    voicevox_speaker_id: 54
    y_offset: -250
    sprites:
      normal: characters/yui/girl_normal.png
      happy: characters/yui/girl_normal.png
      surprise: characters/yui/girl_normal.png
      talking: characters/yui/girl_talking.png

  - id: char_mentor
    name: "田中メンター"
    name_flag: null
    voicevox_speaker_id: 11
    y_offset: -250
    sprites:
      normal: characters/mentor/mentor_nomal.png
      smile: characters/mentor/mentor_nomal.png
      talking: characters/mentor/talking.png

  - id: char_obachan
    name: "田村のおばあさん"
    y_offset: -150
    name_flag: null
    voicevox_speaker_id: 5
    sprites:
      normal: characters/obachan/obachan_nomal.png
      talking: characters/obachan/obachan_talking.png

  - id: char_college_student
    name: "大学生"
    name_flag: null
    voicevox_speaker_id: 99
    y_offset: -180
    sprites:
      normal: characters/college_student/daigakusei_normal.png
      talking: characters/college_student/daigakusei_normal.png

  - id: char_candy_kid
    name: "アメ好きっ子"
    name_flag: null
    voicevox_speaker_id: 8
    y_offset: -250
    sprites:
      normal: characters/kozo/kozo.png
      talking: characters/kozo/kozo.png

  - id: char_candy_sister
    name: "お姉さん"
    name_flag: null
    voicevox_speaker_id: 58
    y_offset: -220
    sprites:
      normal: characters/onee/onee.png
      talking: characters/onee/onee_talking.png

  - id: char_museum_staff
    name: "ミュージアムの受付"
    name_flag: null
    voicevox_speaker_id: 87
    y_offset: -250
    sprites:
      normal: characters/muse/muse_onesan.png
      talking: characters/muse/muse_onesan_talking.png

  - id: char_museum_part_timer
    name: "バイト"
    name_flag: null
    voicevox_speaker_id: 23
    y_offset: -250
    sprites:
      normal: characters/bite/bite.png
      talking: characters/bite/bite_talking.png
  - id: char_oyaji
    name: "おじさん"
    name_flag: null
    voicevox_speaker_id: 53
    y_offset: -250
    sprites:
      normal: characters/yopparai/yoppa.png
      talking: characters/yopparai/yoppa_talking.png

  - id: char_detective
    name: "赤羽の探偵"
    name_flag: null
    voicevox_speaker_id: 13
    y_offset: -250
    sprites:
      normal: characters/tantei/tantei.png
      talking: characters/tantei/tantei_talking.png

  - id: char_priest
    name: "神父さん"
    name_flag: null
    voicevox_speaker_id: 9
    y_offset: -250
    sprites:
      normal: characters/college_student/daigakusei_normal.png
      talking: characters/college_student/daigakusei_normal.png

  - id: char_museum_director
    name: "館長"
    name_flag: null
    voicevox_speaker_id: 81
    y_offset: -300
    sprites:
      normal: characters/kancho/kancho.png
      talking: characters/kancho/kancho_talking.png
`,_=`commands:
  - id: cmd_examine
    label: "調べる"
    icon: null
    description: "周囲をよく調べる"
    action_type: examine

  - id: cmd_talk
    label: "話す"
    icon: null
    description: "その場にいる人に話しかける"
    action_type: talk

  - id: cmd_move
    label: "移動"
    icon: null
    description: "別の場所へ移動する"
    action_type: move

  - id: cmd_inventory
    label: "持ち物"
    icon: null
    description: "所持品を確認する"
    action_type: inventory
`,v=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},y=(e=>e?v(e):v),b=e=>e;function x(e,t=b){let n=a.useSyncExternalStore(e.subscribe,a.useCallback(()=>t(e.getState()),[e,t]),a.useCallback(()=>t(e.getInitialState()),[e,t]));return a.useDebugValue(n),n}var S=e=>{let t=y(e),n=e=>x(t,e);return Object.assign(n,t),n},C=(e=>e?S(e):S),w={bgmVolume:.4,seVolume:.8,voiceVolume:.8,textSpeed:40,autoMode:!1,fullscreen:!1};function T(e){return Object.fromEntries(e.map(e=>[e.id,e.default]))}function E(e,t){if(!e||e.length===0)return t;let n={...t};for(let{flag:t,value:r}of e)n[t]=r;return n}function D(e,t){if(!e)return!0;if(e.and)return e.and.every(e=>D(e,t));if(e.or)return e.or.some(e=>D(e,t));let n=!0;if(e.flag!==void 0){let r=t.flags[e.flag],i=e.value;i!==void 0&&(n&&=r===i),e.min!==void 0&&(n=n&&typeof r==`number`&&r>=e.min),e.max!==void 0&&(n=n&&typeof r==`number`&&r<=e.max)}if(e.has_item!==void 0&&(n&&=t.inventory.includes(e.has_item)),e.item_count!==void 0){let r=new Set(e.item_count.items),i=t.inventory.filter(e=>r.has(e)).length;e.item_count.min!==void 0&&(n&&=i>=e.item_count.min),e.item_count.max!==void 0&&(n&&=i<=e.item_count.max)}return e.location_id!==void 0&&(n&&=t.locationId===e.location_id),e.negate&&(n=!n),n}function O(e,t){if(!e||e.length===0)return t;let n={flags:t.flags,inventory:t.inventory,locationId:t.currentLocationId},r=[...t.inventory];for(let t of e)D(t.condition,n)&&(r.includes(t.item_id)||(r=[...r,t.item_id]));return{...t,inventory:r}}function k(e,t){return{...t,inventory:t.inventory.filter(t=>t!==e)}}function A(e,t,n){let r=n.items[e];if(!r||!r.usable)return!1;let i={flags:t.flags,inventory:t.inventory,locationId:t.currentLocationId};return D(r.use_condition,i)}function j(e,t,n){let r=n.items[e];return!r||!r.usable?{newState:t,sceneId:null}:{newState:t,sceneId:r.use_scene??null}}function M(e,t,n){let r=n.scenes[e];if(!r)return console.warn(`[SceneEngine] Scene not found: ${e}`),t;let i={...t,currentSceneId:e,currentMessageIndex:0,phase:`message`};if(r.location_id&&r.location_id!==t.currentLocationId&&(i={...i,currentLocationId:r.location_id,currentCharacters:[]}),r.characters!==void 0&&(i={...i,currentCharacters:r.characters}),r.messages[0]?.characters!==void 0&&(i={...i,currentCharacters:r.messages[0].characters}),i={...i,flags:E(r.flags_set,i.flags)},r.item_remove)for(let e of r.item_remove)i=k(e,i);return r.messages.length===0?r.game_end?{...i,phase:`ending`}:r.cg_sequence?.length?{...i,phase:`cg_sequence`}:P(i,r,n):i}function N(e,t){let n=t.scenes[e.currentSceneId];if(!n)return e;let r=e.currentMessageIndex+1;if(r<n.messages.length){let t=n.messages[r],i={...e,currentMessageIndex:r};return t.characters===void 0?i:{...i,currentCharacters:t.characters}}return P(e,n,t)}function P(e,t,n){let r=O(t.item_give,e);if(t.game_end)return{...r,phase:`ending`};if(t.next_engine)return{...r,phase:`engine_transition`,pendingEngineTransition:t.next_engine};let i=t.branches,a={flags:r.flags,inventory:r.inventory,locationId:r.currentLocationId};if(i?.type===`choice`&&i.choices&&i.choices.length>0){let e=i.choices.filter(e=>D(e.condition,a));return e.length===1&&e[0].next_scene?M(e[0].next_scene,r,n):{...r,phase:`choice`}}if(i?.type===`auto`&&i.choices){for(let e of i.choices)if(D(e.condition,a))return e.next_scene?M(e.next_scene,r,n):e.next_scene===null?ee(r,n):ne(r,t,n);return ee(r,n)}return t.next_scene?M(t.next_scene,r,n):t.next_scene===null?ee(r,n):ne(r,t,n)}function F(e,t,n){let r=n.scenes[t.currentSceneId];if(!r?.branches?.choices)return t;let i=r.branches.choices[e];return i?i.next_scene?M(i.next_scene,t,n):ee(t,n):t}function ee(e,t){if(e.sceneHistory.length===0)return ne(e,t.scenes[e.currentSceneId],t);let n=[...e.sceneHistory],r=n.pop(),i=t.scenes[r];return{...e,currentSceneId:r,currentMessageIndex:0,sceneHistory:n,phase:`command`,currentCharacters:te(i)}}function te(e){if(!e)return[];let t=e.characters??[];for(let n of e.messages)n.characters!==void 0&&(t=n.characters);return t}function ne(e,t,n){return{...e,phase:`command`}}function re(e,t){let n=t.scenes[e.currentSceneId];return n?P(e,n,t):e}function I(e,t){return{...t,sceneHistory:[...t.sceneHistory,e]}}function ie(e,t,n){return(e?.commands??t?.default_commands??Object.keys(n.commands)).map(e=>n.commands[e]).filter(e=>!!e)}function ae(e,t,n){let r=n.commands[e];if(!r)return{newPhase:t.phase};switch(r.action_type){case`examine`:return{newPhase:`examine`};case`move`:return{newPhase:`map`};case`inventory`:return{newPhase:`inventory`};case`talk`:{let e=n.scenes[t.currentSceneId]?.talkable??[],r={flags:t.flags,inventory:t.inventory,locationId:t.currentLocationId},i=e.filter(e=>D(e.condition??null,r)).map(e=>({characterId:e.character_id,sceneId:e.scene_id}));return i.length===0?{newPhase:`command`}:i.length===1?{newPhase:`message`,transitionSceneId:i[0].sceneId}:{newPhase:`talk_select`,talkCandidates:i}}case`system`:return{newPhase:`system_menu`};default:return{newPhase:t.phase}}}function L(e,t,n){let r=n.locations[e];if(!r)return[];let i={flags:t.flags,inventory:t.inventory,locationId:e};return r.connections.filter(e=>D(e.condition,i))}function oe(e,t,n){let r=n.locations[e];if(!r)return t;let i={...t,currentLocationId:e,currentCharacters:[],sceneHistory:[],phase:`message`};return M(r.entry_scene,i,n)}function se(e,t){return!e.phase&&t?.next_engine?`message`:!e.phase||e.phase===`title`||e.phase===`ending`?`command`:e.phase}function ce(e,t,n,r){let i=T(e.flags);return{currentSceneId:t,currentLocationId:n,currentMessageIndex:0,flags:r?.initialFlags?{...i,...r.initialFlags}:i,inventory:r?.initialInventory??[],sceneHistory:[],phase:`title`,currentCharacters:[],talkCandidates:[]}}function le(e,t,n,r){let i=ce(e,t,n,r);return y((a,o)=>({state:i,masterData:e,chapterId:r?.chapterId??`chapter1`,playtimeStart:Date.now(),startNewGame:()=>{let e=o().masterData;a({state:M(t,{...ce(e,t,n,r),phase:`message`},e),playtimeStart:Date.now()})},startDebugGame:e=>{let i=o().masterData,s=ce(i,t,n,r),c={...s,currentSceneId:e.sceneId,currentLocationId:e.locationId,flags:{...s.flags,...e.flags??{}},inventory:e.inventory??[],phase:`message`};a({state:M(e.sceneId,c,i),playtimeStart:Date.now()})},loadGame:e=>{let t=o().masterData.scenes[e.currentSceneId],n=se(e,t);a({state:{currentSceneId:e.currentSceneId,currentLocationId:e.currentLocationId,currentMessageIndex:e.currentMessageIndex??0,flags:e.flags,inventory:e.inventory,sceneHistory:e.sceneHistory,phase:n,currentCharacters:e.currentCharacters??[],talkCandidates:[],pendingEngineTransition:n===`engine_transition`?t?.next_engine:void 0},playtimeStart:Date.now()-e.playtime*1e3})},toSaveData:()=>{let{state:e,masterData:t,playtimeStart:n}=o();return{version:1,chapterId:o().chapterId,locationName:t.locations[e.currentLocationId]?.name,timestamp:Date.now(),currentSceneId:e.currentSceneId,currentLocationId:e.currentLocationId,currentMessageIndex:e.currentMessageIndex,phase:e.phase,flags:e.flags,inventory:e.inventory,sceneHistory:e.sceneHistory,currentCharacters:e.currentCharacters,playtime:Math.floor((Date.now()-n)/1e3)}},advanceMessage:()=>{let{state:e,masterData:t}=o();e.phase===`message`&&a({state:N(e,t)})},selectChoice:e=>{let{state:t,masterData:n}=o();t.phase===`choice`&&a({state:F(e,t,n)})},executeCommand:e=>{let{state:t,masterData:n}=o();if(t.phase!==`command`)return;let r=ae(e,t,n);if(r.transitionSceneId){let e=I(t.currentSceneId,t);a({state:M(r.transitionSceneId,e,n)})}else a({state:{...t,phase:r.newPhase,talkCandidates:r.talkCandidates??[]}})},selectTalkTarget:e=>{let{state:t,masterData:n}=o();if(t.phase!==`talk_select`)return;if(e<0){a(e=>({state:{...e.state,phase:`command`,talkCandidates:[]}}));return}let r=t.talkCandidates[e];if(!r)return;let i=I(t.currentSceneId,t);a({state:{...M(r.sceneId,i,n),talkCandidates:[]}})},completeCgSequence:()=>{let{state:e,masterData:t}=o();e.phase===`cg_sequence`&&a({state:re(e,t)})},moveToLocation:e=>{let{state:t,masterData:n}=o();a({state:oe(e,t,n)})},clickArea:e=>{let{state:t,masterData:n}=o();if(t.phase!==`examine`)return;let r=n.scenes[t.currentSceneId]?.clickable_areas?.find(t=>t.id===e);if(!r)return;let i={flags:t.flags,inventory:t.inventory,locationId:t.currentLocationId};if(!D(r.condition,i))return;let s=I(t.currentSceneId,t);a({state:M(r.next_scene,s,n)})},useItem:e=>{let{state:t,masterData:n}=o(),{newState:r,sceneId:i}=j(e,t,n);a(i?{state:M(i,I(t.currentSceneId,{...r,phase:`command`}),n)}:{state:r})},closeOverlay:()=>{a(e=>({state:{...e.state,phase:`command`}}))},goToTitle:()=>{a(e=>({state:{...e.state,phase:`title`}}))},startFromScene:(e,t,n)=>{let{state:r,masterData:i}=o();a({state:M(e,{...ce(i,e,t,{}),flags:{...r.flags,...n??{}},inventory:r.inventory,phase:`message`},i),playtimeStart:Date.now()})},debugSetFlag:(e,t)=>{a(n=>({state:{...n.state,flags:{...n.state.flags,[e]:t}}}))},debugSetInventory:e=>{a(t=>({state:{...t.state,inventory:e}}))},debugJumpToScene:(e,t)=>{let{state:n,masterData:r}=o();a({state:M(e,{...n,currentLocationId:t,phase:`message`},r)})}}))}var ue=(0,a.createContext)(null);function de(){let e=(0,a.useContext)(ue);if(!e)throw Error(`useGameStore must be used within a GameStoreContext.Provider`);return x(e)}var R=t(),fe=(0,a.createContext)({resolveAsset:e=>e,resolveVoicePath:e=>`assets/voicevox/${e}.mp3`});function pe({assetsBaseUrl:e,children:t}){let n=e.replace(/\/$/,``),r=(0,a.useMemo)(()=>({resolveAsset:e=>`${n}/${e}`,resolveVoicePath:e=>`${n}/voicevox/${e}.mp3`}),[n]);return(0,R.jsx)(fe.Provider,{value:r,children:t})}function me(){return(0,a.useContext)(fe)}var he=class{prefix=`novel_`;key(e){return`${this.prefix}${e}`}setItem(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{console.warn(`[LocalStorage] Failed to save:`,e)}}getItem(e){try{let t=localStorage.getItem(e);return t?JSON.parse(t):null}catch{return null}}async save(e,t){this.setItem(this.key(`save_${e}`),t)}async load(e){let t=this.getItem(this.key(`save_${e}`));return!t||t.version!==1?null:t}async deleteSave(e){localStorage.removeItem(this.key(`save_${e}`))}async listSaves(){return Array.from({length:10},(e,t)=>{let n=this.getItem(this.key(`save_${t+1}`));return!n||n.version!==1?null:{slotId:t+1,data:n}})}async saveSettings(e){this.setItem(this.key(`settings`),e)}async loadSettings(){return this.getItem(this.key(`settings`))}async autoSave(e){this.setItem(this.key(`autosave`),e)}async loadAutoSave(){let e=this.getItem(this.key(`autosave`));return!e||e.version!==1?null:e}};function ge(e=`localStorage`){switch(e){default:return new he}}var _e=null;function ve(){return _e||=ge(),_e}var z=new class{bgmAudio=null;voiceAudio=null;playBgm(e,t=!0,n=.8){this.bgmAudio&&this.bgmAudio.pause();let r=new Audio(e);r.loop=t,r.volume=n,r.play().catch(()=>{}),this.bgmAudio=r}stopBgm(){this.bgmAudio&&=(this.bgmAudio.pause(),null)}setBgmVolume(e){this.bgmAudio&&(this.bgmAudio.volume=Math.max(0,Math.min(1,e)))}async playVoice(e,t=.9,n){this.voiceAudio&&this.voiceAudio.pause();let r=new Audio(e);r.volume=t,this.voiceAudio=r,n&&r.addEventListener(`ended`,n,{once:!0}),console.log(`[AudioManager] playVoice:`,e.slice(0,60)),await r.play().catch(e=>console.warn(`[AudioManager] play failed:`,e))}stopVoice(){this.voiceAudio&&=(this.voiceAudio.pause(),null)}playSe(e,t=.8){let n=new Audio(e);n.volume=t,n.play().catch(()=>{})}playItemGetSe(e=.4){try{let t=new AudioContext;t.createGain().connect(t.destination);for(let{freq:n,start:r,dur:i}of[{freq:880,start:0,dur:.12},{freq:1320,start:.1,dur:.18}]){let a=t.createOscillator(),o=t.createGain();a.type=`sine`,a.frequency.setValueAtTime(n,t.currentTime+r),o.gain.setValueAtTime(0,t.currentTime+r),o.gain.linearRampToValueAtTime(e,t.currentTime+r+.01),o.gain.exponentialRampToValueAtTime(.001,t.currentTime+r+i),a.connect(o),o.connect(t.destination),a.start(t.currentTime+r),a.stop(t.currentTime+r+i)}setTimeout(()=>t.close(),600)}catch{}}},ye=C((e,t)=>({settings:w,updateSettings:n=>{let r={...t().settings,...n};e({settings:r}),n.bgmVolume!==void 0&&z.setBgmVolume(n.bgmVolume),ve().saveSettings(r).catch(()=>{})},loadSettings:async()=>{let t=await ve().loadSettings().catch(()=>null);t&&(e({settings:{...w,...t}}),z.setBgmVolume(t.bgmVolume??w.bgmVolume))}})),be={btn:`_btn_jkuam_1`,btnLarge:`_btnLarge_jkuam_29`,btnSmall:`_btnSmall_jkuam_34`};function B({label:e,onClick:t,disabled:n,size:r=`normal`}){let i=r===`large`?be.btnLarge:r===`small`?be.btnSmall:``;return(0,R.jsx)(`button`,{className:`${be.btn} ${i}`,onClick:t,disabled:n,children:e})}var xe={overlay:`_overlay_2rhas_1`,box:`_box_2rhas_11`,title:`_title_2rhas_23`,closeBtn:`_closeBtn_2rhas_32`};function Se({title:e,onClose:t,children:n}){return(0,R.jsx)(`div`,{className:xe.overlay,onClick:t,children:(0,R.jsxs)(`div`,{className:xe.box,onClick:e=>e.stopPropagation(),children:[t&&(0,R.jsx)(`button`,{className:xe.closeBtn,onClick:t,children:`×`}),e&&(0,R.jsx)(`div`,{className:xe.title,children:e}),n]})})}var V={slots:`_slots_u89se_1`,slot:`_slot_u89se_1`,slotNum:`_slotNum_u89se_19`,slotInfo:`_slotInfo_u89se_27`,slotMeta:`_slotMeta_u89se_32`,slotChapter:`_slotChapter_u89se_39`,slotLocation:`_slotLocation_u89se_49`,slotData:`_slotData_u89se_57`,slotEmpty:`_slotEmpty_u89se_62`,slotActions:`_slotActions_u89se_68`,tabs:`_tabs_u89se_74`,tab:`_tab_u89se_74`,tabActive:`_tabActive_u89se_91`};function Ce({onSave:e,onLoad:t,onClose:n,initialTab:r=`save`,chapters:i}){let[o,s]=(0,a.useState)(r),[c,l]=(0,a.useState)([]);(0,a.useEffect)(()=>{ve().listSaves().then(l)},[]);async function u(t){await e(t),l(await ve().listSaves())}function d(e){return new Date(e).toLocaleString(`ja-JP`,{month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`})}function f(e){if(!(!e||!i))return i.find(t=>t.id===e)?.title}return(0,R.jsxs)(Se,{title:`セーブ / ロード`,onClose:n,children:[(0,R.jsxs)(`div`,{className:V.tabs,children:[(0,R.jsx)(`button`,{className:`${V.tab} ${o===`save`?V.tabActive:``}`,onClick:()=>s(`save`),children:`セーブ`}),(0,R.jsx)(`button`,{className:`${V.tab} ${o===`load`?V.tabActive:``}`,onClick:()=>s(`load`),children:`ロード`})]}),(0,R.jsx)(`div`,{className:V.slots,children:Array.from({length:10},(e,r)=>{let i=r+1,a=c[r]??null,s=a?f(a.data.chapterId):void 0;return(0,R.jsxs)(`div`,{className:V.slot,children:[(0,R.jsx)(`div`,{className:V.slotNum,children:i}),(0,R.jsx)(`div`,{className:V.slotInfo,children:a?(0,R.jsxs)(R.Fragment,{children:[(0,R.jsxs)(`div`,{className:V.slotMeta,children:[s&&(0,R.jsx)(`span`,{className:V.slotChapter,children:s}),a.data.locationName&&(0,R.jsx)(`span`,{className:V.slotLocation,children:a.data.locationName})]}),(0,R.jsxs)(`div`,{className:V.slotData,children:[d(a.data.timestamp),Math.floor(a.data.playtime/60),`分`]})]}):(0,R.jsx)(`div`,{className:V.slotEmpty,children:`データなし`})}),(0,R.jsxs)(`div`,{className:V.slotActions,children:[o===`save`&&(0,R.jsx)(B,{label:`セーブ`,size:`small`,onClick:()=>u(i)}),o===`load`&&a&&(0,R.jsx)(B,{label:`ロード`,size:`small`,onClick:()=>{t(a.data),n()}})]})]},i)})})]})}var we={root:`_root_loxs2_1`,actions:`_actions_loxs2_12`,continueMenu:`_continueMenu_loxs2_19`,chapterList:`_chapterList_loxs2_26`,sectionLabel:`_sectionLabel_loxs2_33`};function Te({onNewGame:e,onLoad:t,chapters:n,onStartChapter:r}){let[i,o]=(0,a.useState)(!1),[s,c]=(0,a.useState)(!1),[l,u]=(0,a.useState)([]),[d,f]=(0,a.useState)(null),{state:p}=de(),{resolveAsset:m}=me();(0,a.useEffect)(()=>{let e=ve();e.listSaves().then(u),e.loadAutoSave().then(f)},[]);async function h(e){}function g(e){let{unlockFlag:t}=e;return!t||p.flags[t]?!0:l.some(e=>!!e?.data.flags[t])}let _=n?.filter(g)??[],v=l.some(Boolean),y=v||_.length>0;return(0,R.jsxs)(`div`,{className:we.root,style:{backgroundImage:`url(${m(`cg/title.jpg`)})`},children:[(0,R.jsxs)(`div`,{className:we.actions,children:[(0,R.jsx)(B,{label:`はじめから`,size:`large`,onClick:e}),d&&(0,R.jsx)(B,{label:`オートセーブからはじめる`,size:`large`,onClick:()=>t(d)}),y&&(0,R.jsx)(B,{label:`続きから`,size:`large`,onClick:()=>o(!0)})]}),i&&(0,R.jsx)(Se,{title:`続きから`,onClose:()=>o(!1),children:(0,R.jsxs)(`div`,{className:we.continueMenu,children:[v&&(0,R.jsx)(B,{label:`セーブデータをロード`,size:`large`,onClick:()=>{o(!1),c(!0)}}),_.length>0&&(0,R.jsxs)(`div`,{className:we.chapterList,children:[(0,R.jsx)(`div`,{className:we.sectionLabel,children:`章を選ぶ`}),_.map(e=>(0,R.jsx)(B,{label:e.title,size:`large`,onClick:()=>{o(!1),r?.(e)}},`${e.initialSceneId}:${e.initialLocationId}`))]})]})}),s&&(0,R.jsx)(Ce,{onSave:h,onLoad:e=>{c(!1),t(e)},onClose:()=>c(!1),initialTab:`load`,chapters:n})]})}var Ee={root:`_root_1sghz_1`,img:`_img_1sghz_9`,possessed:`_possessed_1sghz_15`,possessedBgPulse:`_possessedBgPulse_1sghz_1`,possessedBgDrift:`_possessedBgDrift_1sghz_1`,fallback:`_fallback_1sghz_58`,locationName:`_locationName_1sghz_66`};function De({backgroundPath:e,locationName:t,possessed:n=!1}){let{resolveAsset:r}=me(),[i,o]=(0,a.useState)(!1),s=e?r(e):null;return(0,a.useEffect)(()=>{o(!1)},[s]),(0,R.jsx)(`div`,{className:`${Ee.root} ${n?Ee.possessed:``}`,children:s&&!i?(0,R.jsx)(`img`,{className:Ee.img,src:s,alt:``,onError:()=>o(!0)}):(0,R.jsx)(`div`,{className:Ee.fallback,children:t&&(0,R.jsx)(`span`,{className:Ee.locationName,children:t})})})}var Oe={root:`_root_egkzc_1`,left:`_left_egkzc_7`,center:`_center_egkzc_11`,right:`_right_egkzc_16`,img:`_img_egkzc_20`,possessed:`_possessed_egkzc_24`,possessedPulse:`_possessedPulse_egkzc_1`,placeholder:`_placeholder_egkzc_46`,placeholderName:`_placeholderName_egkzc_57`};function ke({display:e,character:t,isSpeaking:n}){let{resolveAsset:r}=me(),[i,o]=(0,a.useState)(!1),s=e.expression===`talking`&&!n?`normal`:e.expression,c=n&&t.sprites?.talking?`talking`:s,l=t.sprites?.[c]??t.sprites?.normal,u=l?r(l):null,d=e.expression===`possessed`,f=e.position===`left`?Oe.left:e.position===`right`?Oe.right:Oe.center,p=120+(e.y_offset??t.y_offset??0);return(0,R.jsx)(`div`,{className:`${Oe.root} ${f} ${d?Oe.possessed:``}`,style:{bottom:`${p}px`},children:u&&!i?(0,R.jsx)(`img`,{className:Oe.img,src:u,alt:t.name,onError:()=>o(!0)}):(0,R.jsx)(`div`,{className:Oe.placeholder,children:(0,R.jsx)(`span`,{className:Oe.placeholderName,children:t.name})})})}var Ae={root:`_root_2afjl_1`};function je({text:e,speed:t,onComplete:n,instant:r}){let[i,o]=(0,a.useState)(``),[s,c]=(0,a.useState)(!1),l=(0,a.useRef)(null),u=(0,a.useRef)(0);return(0,a.useEffect)(()=>{if(o(``),c(!1),u.current=0,r||t===0){o(e),c(!0),n?.();return}let i=Math.max(1,Math.floor(1e3/t));return l.current=setInterval(()=>{u.current+=1,o(e.slice(0,u.current)),u.current>=e.length&&(clearInterval(l.current),c(!0),n?.())},i),()=>{l.current&&clearInterval(l.current)}},[e,t,r]),(0,R.jsx)(`span`,{className:Ae.root,children:i})}var Me={baseUrl:`http://localhost:50021`,enabled:!0,prebuiltOnly:!0},Ne=new class{config;constructor(e=Me){this.config=e}async isAvailable(){if(this.config.prebuiltOnly)return!1;try{return(await fetch(`${this.config.baseUrl}/version`,{signal:AbortSignal.timeout(1e3)})).ok}catch{return!1}}async synthesize(e,t){if(!this.config.enabled||this.config.prebuiltOnly)return null;try{let n=await fetch(`${this.config.baseUrl}/audio_query?text=${encodeURIComponent(e)}&speaker=${t}`,{method:`POST`});if(!n.ok)return null;let r=await n.json(),i=await fetch(`${this.config.baseUrl}/synthesis?speaker=${t}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)});return i.ok?i.arrayBuffer():null}catch{return null}}};async function Pe(e){let t=new TextEncoder().encode(e),n=await crypto.subtle.digest(`SHA-1`,t);return Array.from(new Uint8Array(n)).map(e=>e.toString(16).padStart(2,`0`)).join(``)}async function Fe(e,t){return Pe(`${e}_${t}`)}var Ie=new Map;function Le(){let e=(0,a.useRef)(!1),{resolveVoicePath:t}=me();return{speak:(0,a.useCallback)(async(n,r,i)=>{if(console.log(`[Voicevox] speak called:`,{character:r?.id,speakerId:r?.voicevox_speaker_id,voiceCharId:n.voice_character_id}),!r?.voicevox_speaker_id||!n.voice_character_id)return;let a=r.voicevox_speaker_id,o=n.text;e.current=!0;try{let e=await Fe(o,a);if(console.log(`[Voicevox] synthesizing:`,{text:o,speakerId:a,hashKey:e}),Ie.has(e)){console.log(`[Voicevox] cache hit`),await z.playVoice(Ie.get(e),.9,i);return}let n=t(e),r=await fetch(n,{method:`HEAD`}).catch(()=>null);if(r?.ok&&r.headers.get(`content-type`)?.startsWith(`audio/`)){console.log(`[Voicevox] prebuilt hit`),Ie.set(e,n),await z.playVoice(n,.9,i);return}console.log(`[Voicevox] calling engine...`);let s=await Ne.synthesize(o,a);if(!s){console.warn(`[Voicevox] synthesize returned null (engine not running?)`);return}console.log(`[Voicevox] playing synthesized audio`);let c=new Blob([s],{type:`audio/mp3`}),l=URL.createObjectURL(c);Ie.set(e,l),await z.playVoice(l,.9,i)}finally{e.current=!1}},[t]),stop:(0,a.useCallback)(()=>{z.stopVoice()},[])}}var Re={root:`_root_448af_1`,nameplate:`_nameplate_448af_10`,box:`_box_448af_22`,boxNarration:`_boxNarration_448af_32`,text:`_text_448af_42`,textNarration:`_textNarration_448af_48`,arrow:`_arrow_448af_55`,blink:`_blink_448af_1`};function ze({message:e,speaker:t,textSpeed:n,onAdvance:r,onSpeakingChange:i}){let[o,s]=(0,a.useState)(!1),[c,l]=(0,a.useState)(!1),{speak:u,stop:d}=Le();(0,a.useEffect)(()=>{s(!1),l(!1),u(e,t,()=>i?.(!1)),i?.(!0)},[e.text]);function f(){o?(d(),r()):(d(),l(!0),s(!0),i?.(!1))}let p=t?.name??null,m=!p;return(0,R.jsxs)(`div`,{className:Re.root,children:[p&&(0,R.jsx)(`div`,{className:Re.nameplate,children:p}),(0,R.jsxs)(`div`,{className:m?Re.boxNarration:Re.box,onClick:f,children:[(0,R.jsx)(`div`,{className:m?Re.textNarration:Re.text,children:(0,R.jsx)(je,{text:e.text,speed:n,instant:c,onComplete:()=>s(!0)})}),o&&(0,R.jsx)(`span`,{className:Re.arrow,children:`▼`})]})]})}var Be={root:`_root_13pfy_1`,box:`_box_13pfy_10`,choice:`_choice_13pfy_20`};function Ve({choices:e,flags:t,inventory:n,locationId:r,onSelect:i}){let a={flags:t,inventory:n,locationId:r},o=e.map((e,t)=>({choice:e,originalIndex:t})).filter(({choice:e})=>D(e.condition,a));return(0,R.jsx)(`div`,{className:Be.root,children:(0,R.jsx)(`div`,{className:Be.box,children:o.map(({choice:e,originalIndex:t})=>(0,R.jsx)(`button`,{className:Be.choice,onClick:()=>i(t),children:e.label},t))})})}var He={root:`_root_1l2ff_1`,commands:`_commands_1l2ff_12`,cmd:`_cmd_1l2ff_19`};function Ue({commands:e,onSelect:t}){return(0,R.jsx)(`div`,{className:He.root,children:(0,R.jsx)(`div`,{className:He.commands,children:e.map(e=>(0,R.jsx)(`button`,{className:He.cmd,onClick:()=>t(e.id),title:e.description,children:e.label},e.id))})})}var We={root:`_root_13hn2_1`,area:`_area_13hn2_7`,label:`_label_13hn2_23`,hint:`_hint_13hn2_32`,closeBtn:`_closeBtn_13hn2_44`};function Ge({areas:e,flags:t,inventory:n,locationId:r,onClick:i,onClose:a}){let o={flags:t,inventory:n,locationId:r};return(0,R.jsxs)(`div`,{className:We.root,children:[(0,R.jsx)(`div`,{className:We.hint,children:e.length>0?`調べる場所をクリックしてください`:`調べられるものはない`}),e.filter(e=>D(e.condition,o)).map(e=>(0,R.jsx)(`div`,{className:We.area,style:{left:e.x,top:e.y,width:e.width,height:e.height},onClick:()=>i(e.id),children:(0,R.jsx)(`span`,{className:We.label,children:e.label})},e.id)),(0,R.jsx)(`button`,{className:We.closeBtn,onClick:a,children:`閉じる`})]})}var Ke={list:`_list_jaxq_1`,item:`_item_jaxq_8`,empty:`_empty_jaxq_26`};function qe({connections:e,onMove:t,onClose:n}){return(0,R.jsx)(Se,{title:`移動先を選択`,onClose:n,children:(0,R.jsx)(`div`,{className:Ke.list,children:e.length===0?(0,R.jsx)(`p`,{className:Ke.empty,children:`移動できる場所がありません`}):e.map(e=>(0,R.jsx)(`button`,{className:Ke.item,onClick:()=>t(e.location_id),children:e.label},e.location_id))})})}var Je={card:`_card_ryqrj_1`,cardSelected:`_cardSelected_ryqrj_16`,icon:`_icon_ryqrj_21`,iconPlaceholder:`_iconPlaceholder_ryqrj_27`,name:`_name_ryqrj_38`};function Ye({item:e,selected:t,onClick:n}){let{resolveAsset:r}=me(),[i,o]=(0,a.useState)(!1),s=e.icon?r(e.icon):null;return(0,R.jsxs)(`div`,{className:`${Je.card} ${t?Je.cardSelected:``}`,onClick:n,children:[s&&!i?(0,R.jsx)(`img`,{className:Je.icon,src:s,alt:e.name,onError:()=>o(!0)}):(0,R.jsx)(`div`,{className:Je.iconPlaceholder,children:`📦`}),(0,R.jsx)(`span`,{className:Je.name,children:e.name})]})}var Xe={grid:`_grid_1aak1_1`,empty:`_empty_1aak1_9`,detail:`_detail_1aak1_18`,detailName:`_detailName_1aak1_24`,detailDesc:`_detailDesc_1aak1_30`,actions:`_actions_1aak1_37`};function Ze({state:e,masterData:t,onUse:n,onClose:r}){let[i,o]=(0,a.useState)(null),s=e.inventory.map(e=>t.items[e]).filter(e=>!!e),c=i?t.items[i]:null;return(0,R.jsxs)(Se,{title:`持ち物`,onClose:r,children:[(0,R.jsx)(`div`,{className:Xe.grid,children:s.length===0?(0,R.jsx)(`p`,{className:Xe.empty,children:`何も持っていない`}):s.map(e=>(0,R.jsx)(Ye,{item:e,selected:e.id===i,onClick:()=>o(e.id===i?null:e.id)},e.id))}),c&&(0,R.jsxs)(`div`,{className:Xe.detail,children:[(0,R.jsx)(`div`,{className:Xe.detailName,children:c.name}),(0,R.jsx)(`div`,{className:Xe.detailDesc,children:c.description}),(0,R.jsxs)(`div`,{className:Xe.actions,children:[c.usable&&(0,R.jsx)(B,{label:`使う`,disabled:!A(c.id,e,t),onClick:()=>n(c.id)}),(0,R.jsx)(B,{label:`閉じる`,onClick:r,size:`small`})]})]})]})}var Qe={body:`_body_bes5q_1`,row:`_row_bes5q_8`,label:`_label_bes5q_14`,slider:`_slider_bes5q_21`,val:`_val_bes5q_27`,footer:`_footer_bes5q_34`};function $e({onClose:e}){let{settings:t,updateSettings:n}=ye();return(0,R.jsx)(Se,{title:`設定`,onClose:e,children:(0,R.jsxs)(`div`,{className:Qe.body,children:[(0,R.jsxs)(`div`,{className:Qe.row,children:[(0,R.jsx)(`label`,{className:Qe.label,children:`BGM 音量`}),(0,R.jsx)(`input`,{type:`range`,min:0,max:1,step:.05,value:t.bgmVolume,className:Qe.slider,onChange:e=>n({bgmVolume:Number(e.target.value)})}),(0,R.jsx)(`span`,{className:Qe.val,children:Math.round(t.bgmVolume*100)})]}),(0,R.jsxs)(`div`,{className:Qe.row,children:[(0,R.jsx)(`label`,{className:Qe.label,children:`SE 音量`}),(0,R.jsx)(`input`,{type:`range`,min:0,max:1,step:.05,value:t.seVolume,className:Qe.slider,onChange:e=>n({seVolume:Number(e.target.value)})}),(0,R.jsx)(`span`,{className:Qe.val,children:Math.round(t.seVolume*100)})]}),(0,R.jsx)(`div`,{className:Qe.footer,children:(0,R.jsx)(B,{label:`閉じる`,onClick:e,size:`small`})})]})})}var et={btn:`_btn_c2o6e_1`,menuList:`_menuList_c2o6e_22`};function tt({onGetSaveData:e,onLoad:t,onTitle:n,chapters:r}){let[i,o]=(0,a.useState)(!1),[s,c]=(0,a.useState)(!1),[l,u]=(0,a.useState)(!1);async function d(t){await ve().save(t,e())}return(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`button`,{className:et.btn,onClick:()=>o(!0),children:`MENU`}),i&&!s&&!l&&(0,R.jsx)(Se,{title:`システムメニュー`,onClose:()=>o(!1),children:(0,R.jsxs)(`div`,{className:et.menuList,children:[(0,R.jsx)(B,{label:`セーブ / ロード`,onClick:()=>c(!0)}),(0,R.jsx)(B,{label:`設定`,onClick:()=>u(!0)}),(0,R.jsx)(B,{label:`タイトルへ戻る`,onClick:()=>{o(!1),n()}}),(0,R.jsx)(B,{label:`閉じる`,onClick:()=>o(!1),size:`small`})]})}),i&&l&&(0,R.jsx)($e,{onClose:()=>u(!1)}),i&&s&&(0,R.jsx)(Ce,{onSave:d,onLoad:e=>{t(e),c(!1),o(!1)},onClose:()=>c(!1),chapters:r})]})}var nt={overlay:`_overlay_3s7kx_1`,frame:`_frame_3s7kx_10`,cgFadeIn:`_cgFadeIn_3s7kx_1`,left:`_left_3s7kx_18`,right:`_right_3s7kx_23`,center:`_center_3s7kx_28`,progress:`_progress_3s7kx_38`,dot:`_dot_3s7kx_47`,dotActive:`_dotActive_3s7kx_54`},rt=2800;function it({frames:e,onComplete:t}){let{resolveAsset:n}=me(),[r,i]=(0,a.useState)(0),o=(0,a.useCallback)(()=>{i(n=>n<e.length-1?n+1:(t(),n))},[e.length,t]);(0,a.useEffect)(()=>{let e=setTimeout(o,rt);return()=>clearTimeout(e)},[r,o]);let s=e[r],c=n(s.src);return(0,R.jsxs)(`div`,{className:nt.overlay,onClick:o,children:[(0,R.jsx)(`img`,{src:c,alt:``,className:`${nt.frame} ${nt[s.position]}`},r),(0,R.jsx)(`div`,{className:nt.progress,children:e.map((e,t)=>(0,R.jsx)(`div`,{className:`${nt.dot} ${t===r?nt.dotActive:``}`},t))})]})}var H={root:`_root_1ai4y_1`,imageStage:`_imageStage_1ai4y_9`,cgFrame:`_cgFrame_1ai4y_16`,cgMontage:`_cgMontage_1ai4y_1`,cgFrameLast:`_cgFrameLast_1ai4y_25`,cgMontageHold:`_cgMontageHold_1ai4y_1`,backdropImg:`_backdropImg_1ai4y_29`,wideImg:`_wideImg_1ai4y_39`,vignette:`_vignette_1ai4y_51`,creditsLayer:`_creditsLayer_1ai4y_73`,scrollWrap:`_scrollWrap_1ai4y_84`,scrollUp:`_scrollUp_1ai4y_1`,creditMainTitle:`_creditMainTitle_1ai4y_99`,creditSection:`_creditSection_1ai4y_107`,creditName:`_creditName_1ai4y_114`,creditSpacer:`_creditSpacer_1ai4y_121`,finText:`_finText_1ai4y_125`,finFadeIn:`_finFadeIn_1ai4y_1`},at=12e3,ot=6e3,st=[{kind:`spacer`},{kind:`section`,text:`STORY & SCRIPT`},{kind:`name`,text:`Anonymous`},{kind:`spacer`},{kind:`section`,text:`CHARACTER DESIGN`},{kind:`name`,text:`Anonymous`},{kind:`spacer`},{kind:`section`,text:`VOICE ACTING`},{kind:`name`,text:`VOICEVOX`},{kind:`spacer`},{kind:`section`,text:`MUSIC`},{kind:`name`,text:`Anonymous`},{kind:`spacer`},{kind:`section`,text:`PROGRAMMING`},{kind:`name`,text:`Anonymous`},{kind:`spacer`},{kind:`section`,text:`SPECIAL THANKS`},{kind:`name`,text:`CoderDojo 赤羽`},{kind:`spacer`},{kind:`name`,text:`Thank you for playing.`}];function ct({title:e,items:t,durationSec:n}){return(0,R.jsx)(`div`,{className:H.scrollWrap,style:{animationDuration:`${n}s`},children:[{kind:`mainTitle`,text:e},...t].map((e,t)=>e.kind===`mainTitle`?(0,R.jsx)(`div`,{className:H.creditMainTitle,children:e.text},t):e.kind===`section`?(0,R.jsx)(`div`,{className:H.creditSection,children:e.text},t):e.kind===`name`?(0,R.jsx)(`div`,{className:H.creditName,children:e.text},t):(0,R.jsx)(`div`,{className:H.creditSpacer},t))})}function lt({frames:e}){let{resolveAsset:t}=me(),n=e.slice(0,4),r=at/Math.max(n.length,1);return(0,R.jsx)(`div`,{className:H.imageStage,children:n.map((e,i)=>{let a=t(e.src);return(0,R.jsxs)(`div`,{className:`${H.cgFrame} ${i===n.length-1?H.cgFrameLast:``}`,style:{animationDelay:`${i*r}ms`,animationDuration:`${at}ms`},children:[(0,R.jsx)(`img`,{className:H.backdropImg,src:a,alt:``}),(0,R.jsx)(`img`,{className:H.wideImg,src:a,alt:``})]},`${e.src}-${i}`)})})}function ut({frames:e,title:t=`赤羽の一日`,onTitle:n}){let[r,i]=(0,a.useState)(1),o=e.slice(0,4);return(0,a.useEffect)(()=>{let e=setTimeout(()=>i(2),at),t=setTimeout(n,at+ot);return()=>{clearTimeout(e),clearTimeout(t)}},[]),(0,R.jsxs)(`div`,{className:H.root,children:[(0,R.jsx)(lt,{frames:o}),(0,R.jsx)(`div`,{className:H.vignette}),(0,R.jsx)(`div`,{className:H.creditsLayer,children:(0,R.jsx)(ct,{title:t,items:st,durationSec:at/1e3})}),r===2&&(0,R.jsx)(`div`,{className:H.finText,children:`Fin`})]})}var U={overlay:`_overlay_1qhfm_1`,popup:`_popup_1qhfm_11`,popIn:`_popIn_1qhfm_1`,leaving:`_leaving_1qhfm_24`,popOut:`_popOut_1qhfm_1`,header:`_header_1qhfm_38`,body:`_body_1qhfm_47`,iconBox:`_iconBox_1qhfm_53`,iconImg:`_iconImg_1qhfm_66`,iconDefault:`_iconDefault_1qhfm_72`,info:`_info_1qhfm_77`,itemName:`_itemName_1qhfm_82`,itemDesc:`_itemDesc_1qhfm_93`},dt=2500;function ft({item:e,onDismiss:t}){let{resolveAsset:n}=me(),[r,i]=(0,a.useState)(!1),o=(0,a.useRef)(!1);function s(){o.current||(o.current=!0,i(!0),setTimeout(t,280))}return(0,a.useEffect)(()=>{z.playItemGetSe();let e=setTimeout(s,dt);return()=>clearTimeout(e)},[]),(0,R.jsx)(`div`,{className:U.overlay,children:(0,R.jsxs)(`div`,{className:`${U.popup}${r?` ${U.leaving}`:``}`,onClick:s,children:[(0,R.jsx)(`div`,{className:U.header,children:`✦ アイテムを手に入れた！ ✦`}),(0,R.jsxs)(`div`,{className:U.body,children:[(0,R.jsx)(`div`,{className:U.iconBox,children:e.icon?(0,R.jsx)(`img`,{src:n(e.icon),alt:e.name,className:U.iconImg}):(0,R.jsx)(`span`,{className:U.iconDefault,children:`📦`})}),(0,R.jsxs)(`div`,{className:U.info,children:[(0,R.jsx)(`div`,{className:U.itemName,children:e.name}),(0,R.jsx)(`div`,{className:U.itemDesc,children:e.description})]})]})]})})}var pt={root:`_root_1p21m_1`,cgOverlay:`_cgOverlay_1p21m_11`,cgFadeIn:`_cgFadeIn_1p21m_1`,focusOverlay:`_focusOverlay_1p21m_21`,focusOverlayImage:`_focusOverlayImage_1p21m_36`};function mt({onLoadGame:e,onTitle:t,chapters:n}){let{state:r,masterData:i,advanceMessage:o,selectChoice:s,executeCommand:c,selectTalkTarget:l,completeCgSequence:u,moveToLocation:d,clickArea:f,useItem:p,closeOverlay:m,goToTitle:h,toSaveData:g}=de(),{settings:_}=ye(),{resolveAsset:v}=me(),y=i.scenes[r.currentSceneId],b=i.locations[r.currentLocationId],x=y?.messages[r.currentMessageIndex],S=x?.voice_character_id,C=S?i.characters[S]??null:null,w=ie(y,b,i),T=L(r.currentLocationId,r,i),E=y?.branches?.choices??[],[D,O]=(0,a.useState)(!1),k=x?.voice_character_id??null,A=D&&r.phase===`message`,j=(0,a.useRef)(r.inventory),[M,N]=(0,a.useState)([]);(0,a.useEffect)(()=>{if(r.phase===`message`)return;let e=j.current,t=r.inventory.filter(t=>!e.includes(t));j.current=r.inventory,t.length>0&&N(e=>[...e,...t])},[r.inventory,r.phase]);let P=(0,a.useCallback)(()=>{N(e=>e.slice(1))},[]),F=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let e=y?.bgm;!e||e===F.current||(F.current=e,z.playBgm(v(e),!0,_.bgmVolume))},[y?.bgm]),(0,a.useEffect)(()=>{r.phase===`title`&&(z.stopBgm(),F.current=null)},[r.phase]),(0,a.useEffect)(()=>{r.phase===`engine_transition`&&(z.stopBgm(),z.stopVoice(),F.current=null)},[r.phase]),(0,a.useEffect)(()=>()=>{z.stopBgm(),z.stopVoice()},[]),(0,a.useEffect)(()=>{let e=e=>{e.key!==`Enter`&&e.key!==` `||r.phase===`message`&&(e.preventDefault(),o())};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[r.phase,o]),(0,R.jsxs)(`div`,{className:pt.root,children:[(0,R.jsx)(De,{backgroundPath:y?.background,locationName:b?.name,possessed:y?.background_effect===`possessed`||r.currentCharacters.some(e=>e.expression===`possessed`)}),r.phase!==`examine`&&r.currentCharacters.map(e=>{let t=i.characters[e.character_id];return t?(0,R.jsx)(ke,{display:e,character:t,isSpeaking:A&&e.character_id===k},e.character_id):null}),r.phase===`message`&&y?.overlay_image&&(0,R.jsx)(`div`,{className:pt.cgOverlay,style:{backgroundImage:`url(${v(y.overlay_image)})`}}),r.phase===`message`&&x?.focus_overlay_image&&(0,R.jsx)(`div`,{className:pt.focusOverlay,children:(0,R.jsx)(`img`,{className:pt.focusOverlayImage,src:v(x.focus_overlay_image),alt:``})}),r.phase===`examine`&&(0,R.jsx)(Ge,{areas:y?.clickable_areas??[],flags:r.flags,inventory:r.inventory,locationId:r.currentLocationId,onClick:f,onClose:m}),r.phase===`message`&&x&&(0,R.jsx)(ze,{message:x,speaker:C,textSpeed:_.textSpeed,onAdvance:o,onSpeakingChange:O}),r.phase===`choice`&&(0,R.jsx)(Ve,{choices:E,flags:r.flags,inventory:r.inventory,locationId:r.currentLocationId,onSelect:s}),r.phase===`talk_select`&&(0,R.jsx)(Ve,{choices:[...r.talkCandidates.map(e=>({label:i.characters[e.characterId]?.name??e.characterId,next_scene:e.sceneId,condition:null})),{label:`やめる`,next_scene:``,condition:null}],flags:r.flags,inventory:r.inventory,locationId:r.currentLocationId,onSelect:e=>e===r.talkCandidates.length?l(-1):l(e)}),r.phase===`command`&&(0,R.jsx)(Ue,{commands:w,onSelect:c}),r.phase===`map`&&(0,R.jsx)(qe,{connections:T,onMove:d,onClose:m}),r.phase===`inventory`&&(0,R.jsx)(Ze,{state:r,masterData:i,onUse:p,onClose:m}),r.phase===`cg_sequence`&&y?.cg_sequence&&(0,R.jsx)(it,{frames:y.cg_sequence,onComplete:u}),M.length>0&&r.phase!==`ending`&&i.items[M[0]]&&(0,R.jsx)(ft,{item:i.items[M[0]],onDismiss:P},M[0]),r.phase!==`ending`&&(0,R.jsx)(tt,{onGetSaveData:g,onLoad:e,onTitle:h,chapters:n}),r.phase===`ending`&&(0,R.jsx)(ut,{frames:y?.cg_sequence??[],title:y?.ending_title,onTitle:t??h})]})}var ht=[`一`,`二`,`三`,`四`,`五`,`六`,`七`,`八`,`九`,`十`],gt=4500;function _t({chapter:e,chapterIndex:t,onDismiss:n}){let r=ht[t]??String(t+1);return(0,a.useEffect)(()=>{let e=setTimeout(n,gt);return()=>clearTimeout(e)},[n]),(0,a.useEffect)(()=>{let e=e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n())};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[n]),(0,R.jsxs)(`div`,{onClick:n,style:{position:`absolute`,inset:0,background:`#06060a`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,zIndex:200,cursor:`pointer`,userSelect:`none`,animation:`chapterFadeIn 0.9s ease-out both`},children:[(0,R.jsx)(`style`,{children:`
        @keyframes chapterFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}),(0,R.jsx)(`div`,{style:{width:160,height:1,background:`linear-gradient(to right, transparent, rgba(204,170,102,0.5), transparent)`,marginBottom:28}}),(0,R.jsxs)(`div`,{style:{fontFamily:`serif`,fontSize:14,letterSpacing:`0.5em`,color:`rgba(204,170,102,0.65)`,marginBottom:20},children:[`第`,r,`章`]}),(0,R.jsx)(`div`,{style:{fontFamily:`serif`,fontSize:34,letterSpacing:`0.18em`,color:`#ede0c0`,textShadow:`0 0 40px rgba(204,170,102,0.25)`,marginBottom:e.subtitle?14:0},children:e.chapterTitle}),e.subtitle&&(0,R.jsx)(`div`,{style:{fontFamily:`serif`,fontSize:13,letterSpacing:`0.25em`,color:`rgba(204,170,102,0.55)`,marginTop:4},children:e.subtitle}),(0,R.jsx)(`div`,{style:{width:160,height:1,background:`linear-gradient(to right, transparent, rgba(204,170,102,0.5), transparent)`,marginTop:28}}),(0,R.jsx)(`div`,{style:{position:`absolute`,bottom:22,fontSize:11,letterSpacing:`0.08em`,color:`rgba(204,170,102,0.28)`},children:`クリック / [Enter] で続ける`})]})}var vt=`__novel_debug_start__`;function yt(){let e=()=>{let e=Math.min(window.innerWidth/800,window.innerHeight/600);return document.fullscreenElement?e:Math.min(1,e)},[t,n]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let t=()=>n(e());return window.addEventListener(`resize`,t),document.addEventListener(`fullscreenchange`,t),()=>{window.removeEventListener(`resize`,t),document.removeEventListener(`fullscreenchange`,t)}},[]),t}function bt(){let[e,t]=(0,a.useState)(!!document.fullscreenElement);return(0,a.useEffect)(()=>{let e=()=>t(!!document.fullscreenElement);return document.addEventListener(`fullscreenchange`,e),()=>document.removeEventListener(`fullscreenchange`,e)},[]),{isFullscreen:e,toggle:()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}}}function xt({onEngineTransition:e,autoStart:t,chapters:n,onNewGame:r,onStartChapter:i,onLoadGame:o,chapterId:s}){let{state:c,masterData:l,toSaveData:u,startNewGame:d,startDebugGame:f,goToTitle:p,debugSetFlag:m,debugSetInventory:h,debugJumpToScene:g}=de(),{loadSettings:_}=ye(),v=yt(),{isFullscreen:y,toggle:b}=bt(),x=(0,a.useRef)(e);x.current=e;let S=(0,a.useRef)(!1),[C,w]=(0,a.useState)(null);function T(e,t){if(!e.chapterTitle){t();return}let r=(n??[]).findIndex(t=>t.id===e.id);w({chapter:e,index:Math.max(0,r),action:t})}function E(){if(!C)return;let e=C.action;w(null),e()}function D(){let e=(n??[])[0];e?T(e,r):r()}let O=(0,a.useCallback)(e=>{T(e,()=>i(e))},[n,i]),k=(0,a.useCallback)(()=>{let e=n??[],t=e[e.findIndex(e=>e.id===s)+1];t?T(t,()=>i(t)):p()},[n,s,i,p]);(0,a.useEffect)(()=>{if(_(),t){d();return}let e=localStorage.getItem(vt);if(e){S.current=!0,localStorage.removeItem(vt);try{f(JSON.parse(e))}catch{}}},[]),(0,a.useEffect)(()=>{S.current&&localStorage.setItem(`__novel_debug_state__`,JSON.stringify({flags:c.flags,inventory:c.inventory,currentSceneId:c.currentSceneId,currentLocationId:c.currentLocationId,phase:c.phase}))},[c.flags,c.inventory,c.currentSceneId,c.currentLocationId,c.phase]),(0,a.useEffect)(()=>{let e=e=>{if(!(!S.current||e.key!==`__novel_debug_cmd__`||!e.newValue))try{let t=JSON.parse(e.newValue);t.type===`setFlag`?m(t.flagId,t.value):t.type===`setInventory`?h(t.inventory):t.type===`jumpToScene`&&g(t.sceneId,t.locationId)}catch{}};return window.addEventListener(`storage`,e),()=>window.removeEventListener(`storage`,e)},[m,h,g]),(0,a.useEffect)(()=>{c.phase===`engine_transition`&&c.pendingEngineTransition&&x.current?.(c.flags,c.inventory,c.pendingEngineTransition,s)},[c.phase,c.pendingEngineTransition,s]);let A=(0,a.useRef)(null);return(0,a.useEffect)(()=>{if(c.phase===`title`||c.phase===`ending`||c.phase===`engine_transition`)return;let e=l.scenes[c.currentSceneId];if(!e?.autosave)return;let t=`${s}:${c.currentSceneId}`;if(A.current===t)return;A.current=t;let n=u();ve().autoSave({...n,timestamp:Date.now(),locationName:e.autosave_label??n.locationName}).catch(()=>{})},[s,l.scenes,c.currentSceneId,c.phase,u]),(0,R.jsxs)(`div`,{className:`app-wrapper`,children:[(0,R.jsxs)(`div`,{className:`game-container`,style:{transform:`scale(${v})`},children:[C&&(0,R.jsx)(_t,{chapter:C.chapter,chapterIndex:C.index,onDismiss:E}),c.phase===`title`?(0,R.jsx)(Te,{onNewGame:D,onLoad:o,chapters:n,onStartChapter:O}):(0,R.jsx)(mt,{onLoadGame:o,onTitle:k,chapters:n})]}),(0,R.jsx)(`button`,{className:`fullscreen-btn`,onClick:b,title:y?`全画面解除`:`全画面表示`,children:y?`⊠`:`⛶`})]})}function St({masterData:e,assetsBaseUrl:t,config:n,initialFlags:r,initialInventory:i,autoStart:o,onEngineTransition:s}){let c=n.chapters??[],l=c.find(e=>e.id===(n.chapterId??`chapter1`))??c[0]??{id:n.chapterId??`chapter1`,title:`本編`,masterData:e,initialSceneId:n.initialSceneId,initialLocationId:n.initialLocationId,initialFlags:r};function u(e,t,n){return le(e.masterData,e.initialSceneId,e.initialLocationId,{chapterId:e.id,initialFlags:t,initialInventory:n})}let[d,f]=(0,a.useState)(()=>({key:0,chapter:l,store:u({...l,initialSceneId:n.initialSceneId},r,i)}));function p(e){let t=u(e,{...e.unlockFlag?{[e.unlockFlag]:!0}:{},...e.initialFlags??{}},[]);t.getState().startNewGame(),f(n=>({key:n.key+1,chapter:e,store:t}))}function m(){p(l)}function h(e){let t=e.chapterId??`chapter1`,n=c.find(e=>e.id===t)??l,r=u(n,e.flags,e.inventory);r.getState().loadGame({...e,chapterId:n.id}),f(e=>({key:e.key+1,chapter:n,store:r}))}let g=(0,a.useCallback)((e,t,n,r)=>{s?.(e,t,n,r)},[s]);return(0,R.jsx)(pe,{assetsBaseUrl:t,children:(0,R.jsx)(ue.Provider,{value:d.store,children:(0,R.jsx)(xt,{onEngineTransition:g,autoStart:o,chapters:c,onNewGame:m,onStartChapter:p,onLoadGame:h,chapterId:d.chapter.id},d.key)})})}function Ct(e){return Object.fromEntries(e.map(e=>[e.id,e]))}function wt(e,t={}){let n=[];for(let r of e){let{child_scenes:e,...i}=r,a={...t,...i};n.push(a),e?.length&&n.push(...wt(e,{location_id:a.location_id,background:a.background,bgm:a.bgm}))}return n}function Tt(e){let t=r.load(e.scenes),n=r.load(e.flags),i=r.load(e.items),a=r.load(e.locations),o=r.load(e.characters),s=r.load(e.commands);return{scenes:Ct(wt(t.scenes)),flags:n.flags,items:Ct(i.items),locations:Ct(a.locations),characters:Ct(o.characters),commands:Ct(s.commands)}}var Et={chapter1:s,chapter2:c,chapter3:l,chapter4:u,chapter5:d,chapter6:f},Dt={};function Ot(e=`chapter1`){return Dt[e]??=Tt({scenes:Et[e],flags:p,items:m,locations:h,characters:g,commands:_}),Dt[e]}var kt={fade:400,wipe:350,flash:150,speedline:720,rift:820,cardflip:680,numberstorm:860,timing:760,none:0},At=[{value:`7`,left:`8%`,top:`14%`,size:66,delay:0,rotate:-18,color:`#fff2a8`},{value:`3`,left:`20%`,top:`72%`,size:52,delay:90,rotate:14,color:`#8be9ff`},{value:`+`,left:`34%`,top:`24%`,size:46,delay:150,rotate:-9,color:`#ff9fd5`},{value:`12`,left:`48%`,top:`68%`,size:74,delay:40,rotate:11,color:`#ffffff`},{value:`5`,left:`62%`,top:`18%`,size:58,delay:220,rotate:17,color:`#b6ff8b`},{value:`9`,left:`78%`,top:`58%`,size:68,delay:120,rotate:-13,color:`#ffd18b`},{value:`=`,left:`86%`,top:`30%`,size:48,delay:260,rotate:8,color:`#fff2a8`},{value:`21`,left:`12%`,top:`46%`,size:82,delay:300,rotate:10,color:`#ffffff`},{value:`4`,left:`42%`,top:`8%`,size:44,delay:360,rotate:-16,color:`#8be9ff`},{value:`6`,left:`70%`,top:`78%`,size:50,delay:430,rotate:18,color:`#ff9fd5`}],jt=`
@keyframes hub-fade-out  { from { opacity: 0 } to { opacity: 1 } }
@keyframes hub-fade-in   { from { opacity: 1 } to { opacity: 0 } }
@keyframes hub-wipe-out  { from { transform: translateX(-100%) } to { transform: translateX(0%) } }
@keyframes hub-wipe-in   { from { transform: translateX(0%)    } to { transform: translateX(100%) } }
@keyframes hub-flash-out { from { opacity: 0 } to { opacity: 1 } }
@keyframes hub-flash-in  { from { opacity: 1 } to { opacity: 0 } }
@keyframes hub-speedline-out {
  0%   { opacity: 0; transform: scaleX(0.25) skewX(-10deg); filter: brightness(1); }
  45%  { opacity: 1; transform: scaleX(1.15) skewX(-10deg); filter: brightness(1.9); }
  100% { opacity: 1; transform: scaleX(1) skewX(0deg); filter: brightness(1.35); }
}
@keyframes hub-speedline-in {
  0%   { opacity: 1; transform: scaleX(1) skewX(0deg); filter: brightness(1.35); }
  55%  { opacity: 0.82; transform: scaleX(1.2) skewX(10deg); filter: brightness(1.8); }
  100% { opacity: 0; transform: scaleX(0.35) skewX(10deg); filter: brightness(1); }
}
@keyframes hub-rift-out {
  0%   { opacity: 0; transform: scale(1.18) rotate(0deg); filter: blur(0px) brightness(1); }
  40%  { opacity: 1; transform: scale(1.04) rotate(-1deg); filter: blur(2px) brightness(1.4); }
  100% { opacity: 1; transform: scale(0.98) rotate(0deg); filter: blur(0px) brightness(0.78); }
}
@keyframes hub-rift-in {
  0%   { opacity: 1; transform: scale(0.98) rotate(0deg); filter: blur(0px) brightness(0.78); }
  45%  { opacity: 0.85; transform: scale(1.06) rotate(1deg); filter: blur(2px) brightness(1.35); }
  100% { opacity: 0; transform: scale(1.2) rotate(0deg); filter: blur(0px) brightness(1); }
}
@keyframes hub-cardflip-out {
  0%   { opacity: 0; transform: perspective(900px) rotateY(-90deg) scale(0.85); filter: brightness(1); }
  42%  { opacity: 1; transform: perspective(900px) rotateY(8deg) scale(1.02); filter: brightness(1.35); }
  100% { opacity: 1; transform: perspective(900px) rotateY(0deg) scale(1); filter: brightness(0.9); }
}
@keyframes hub-cardflip-in {
  0%   { opacity: 1; transform: perspective(900px) rotateY(0deg) scale(1); filter: brightness(0.9); }
  46%  { opacity: 0.9; transform: perspective(900px) rotateY(-10deg) scale(1.02); filter: brightness(1.3); }
  100% { opacity: 0; transform: perspective(900px) rotateY(90deg) scale(0.85); filter: brightness(1); }
}
@keyframes hub-numberstorm-out {
  0%   { opacity: 0; transform: scale(0.92) rotate(-2deg); filter: brightness(1); }
  35%  { opacity: 1; transform: scale(1.04) rotate(1deg); filter: brightness(1.35); }
  100% { opacity: 1; transform: scale(1.01) rotate(0deg); filter: brightness(1.12); }
}
@keyframes hub-numberstorm-in {
  0%   { opacity: 1; transform: scale(1.01) rotate(0deg); filter: brightness(1.12); }
  45%  { opacity: 0.86; transform: scale(1.05) rotate(-1deg); filter: brightness(1.25); }
  100% { opacity: 0; transform: scale(1.16) rotate(2deg); filter: brightness(1); }
}
@keyframes hub-number-fly {
  0%   { opacity: 0; transform: translate3d(-42vw, 22vh, 0) rotate(-28deg) scale(0.35); }
  18%  { opacity: 1; }
  55%  { opacity: 1; transform: translate3d(0, 0, 0) rotate(0deg) scale(1.08); }
  100% { opacity: 0; transform: translate3d(38vw, -24vh, 0) rotate(30deg) scale(0.62); }
}
@keyframes hub-number-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.84; }
  50%      { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
}
@keyframes hub-timing-out {
  0%   { opacity: 0; transform: scale(1.12); filter: brightness(1); }
  42%  { opacity: 1; transform: scale(1.02); filter: brightness(1.55); }
  100% { opacity: 1; transform: scale(1); filter: brightness(0.88); }
}
@keyframes hub-timing-in {
  0%   { opacity: 1; transform: scale(1); filter: brightness(0.88); }
  48%  { opacity: 0.88; transform: scale(1.05); filter: brightness(1.45); }
  100% { opacity: 0; transform: scale(1.16); filter: brightness(1); }
}
@keyframes hub-timing-sweep {
  0%   { transform: translateX(-58vw); opacity: 0; }
  14%  { opacity: 1; }
  100% { transform: translateX(58vw); opacity: 0; }
}
@keyframes hub-timing-ring {
  0%, 100% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.66; }
  50%      { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
}
`;function Mt({engines:e,initial:t,initialContext:n,defaultTransition:r=`none`}){let[i,o]=(0,a.useState)(n),[s,c]=(0,a.useState)(t),[l,u]=(0,a.useState)(`idle`),[d,f]=(0,a.useState)(`none`),p=(0,a.useRef)(null);function m(e,t){let n=null;if(t?n={engineId:t.engineId,config:t.config,returnEngineId:t.returnEngineId,returnConfig:t.returnConfig,returnTransition:t.returnTransition}:s.returnEngineId&&(n={engineId:s.returnEngineId,config:s.returnConfig}),!n)return;let i=(t?t.transition:s.returnTransition)??r??`none`;if(i===`none`||!(i in kt)){o(e),c(n);return}p.current={updated:e,next:n},f(i),u(`out`)}(0,a.useEffect)(()=>{if(l!==`out`)return;let e=setTimeout(()=>{p.current&&=(o(p.current.updated),c(p.current.next),null),u(`in`)},kt[d]);return()=>clearTimeout(e)},[l,d]),(0,a.useEffect)(()=>{if(l!==`in`)return;let e=setTimeout(()=>u(`idle`),kt[d]);return()=>clearTimeout(e)},[l,d]);let h=e[s.engineId];if(!h)return(0,R.jsxs)(`div`,{style:{padding:24,color:`red`},children:[`Engine not found: `,s.engineId]});let g=h.component,_=l!==`idle`,v=d===`flash`?`#fff`:d===`speedline`?[`radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0 5%, rgba(255,210,90,0.78) 9%, rgba(255,120,70,0.38) 18%, rgba(0,0,0,0.92) 58%)`,`repeating-linear-gradient(100deg, rgba(255,255,255,0.95) 0 8px, rgba(255,210,90,0.35) 8px 14px, rgba(0,0,0,0) 14px 34px)`,`#050505`].join(`, `):d===`rift`?[`radial-gradient(circle at 50% 50%, rgba(190,120,255,0.95) 0 4%, rgba(80,20,120,0.82) 13%, rgba(12,2,24,0.98) 54%, #000 100%)`,`repeating-conic-gradient(from 0deg, rgba(210,170,255,0.24) 0deg 7deg, rgba(0,0,0,0) 7deg 18deg)`,`#000`].join(`, `):d===`cardflip`?[`radial-gradient(circle at 50% 50%, rgba(255,245,210,0.9) 0 8%, rgba(110,45,80,0.84) 34%, rgba(12,8,22,0.98) 74%)`,`linear-gradient(90deg, rgba(255,255,255,0.20) 0 1px, transparent 1px 80px)`,`linear-gradient(0deg, rgba(255,255,255,0.16) 0 1px, transparent 1px 112px)`,`#0d0712`].join(`, `):d===`numberstorm`?[`radial-gradient(circle at 50% 46%, rgba(255,255,255,0.98) 0 6%, rgba(255,230,92,0.74) 14%, rgba(25,190,220,0.38) 33%, rgba(21,24,60,0.96) 72%)`,`repeating-linear-gradient(24deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 28px)`,`repeating-linear-gradient(116deg, rgba(255,223,92,0.17) 0 2px, transparent 2px 34px)`,`#11183c`].join(`, `):d===`timing`?[`radial-gradient(circle at 50% 50%, rgba(255,246,160,0.95) 0 5%, rgba(255,80,124,0.58) 16%, rgba(18,12,32,0.96) 68%, #05050a 100%)`,`repeating-linear-gradient(90deg, rgba(255,235,120,0.28) 0 3px, transparent 3px 54px)`,`repeating-linear-gradient(0deg, rgba(255,95,135,0.16) 0 2px, transparent 2px 42px)`].join(`, `):`#000`,y=_?{position:`fixed`,inset:0,zIndex:9999,pointerEvents:`all`,backgroundSize:d===`speedline`?`100% 100%, 220px 100%, 100% 100%`:d===`rift`?`100% 100%, 180px 180px, 100% 100%`:d===`cardflip`?`100% 100%, 80px 100%, 100% 112px, 100% 100%`:d===`numberstorm`?`100% 100%, 120px 120px, 150px 150px, 100% 100%`:d===`timing`?`100% 100%, 54px 100%, 100% 42px`:void 0,animation:`hub-${d}-${l} ${kt[d]}ms ease forwards`,...v.includes(`gradient(`)?{backgroundImage:v,backgroundColor:`#000`}:{backgroundColor:v}}:{position:`fixed`,inset:0,zIndex:9999,pointerEvents:`none`,opacity:0};return(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`style`,{children:jt}),(0,R.jsx)(g,{context:i,config:s.config,onExit:m}),(0,R.jsxs)(`div`,{style:y,children:[_&&d===`speedline`&&(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#fff7c8`,fontFamily:`'Impact', 'Arial Black', sans-serif`,fontSize:96,letterSpacing:0,textShadow:`0 0 18px rgba(255,118,54,0.95), 0 8px 0 rgba(0,0,0,0.55)`,transform:l===`out`?`rotate(-5deg) scale(1.08)`:`rotate(5deg) scale(0.96)`},children:`RUN!`}),_&&d===`cardflip`&&(0,R.jsx)(`div`,{style:{position:`absolute`,left:`50%`,top:`50%`,width:190,height:260,borderRadius:8,border:`2px solid rgba(255,245,210,0.95)`,background:`linear-gradient(145deg, rgba(255,245,210,0.96), rgba(170,80,130,0.92))`,boxShadow:`0 0 30px rgba(255,230,160,0.8), inset 0 0 0 10px rgba(70,22,48,0.32)`,transform:`translate(-50%, -50%) ${l===`out`?`rotate(-4deg)`:`rotate(4deg)`}`}}),_&&d===`numberstorm`&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`div`,{style:{position:`absolute`,left:`50%`,top:`50%`,width:210,height:210,borderRadius:`50%`,background:`radial-gradient(circle, rgba(255,255,255,0.96) 0 18%, rgba(255,222,82,0.84) 31%, rgba(34,206,230,0.22) 56%, transparent 70%)`,boxShadow:`0 0 34px rgba(255,234,94,0.85), 0 0 72px rgba(73,220,255,0.48)`,animation:`hub-number-pulse 520ms ease-in-out infinite`}}),(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#162057`,fontFamily:`'Arial Black', 'Impact', sans-serif`,fontSize:64,letterSpacing:0,textShadow:`0 2px 0 rgba(255,255,255,0.8), 0 0 16px rgba(255,241,124,0.9)`},children:`COUNT!`}),At.map((e,t)=>(0,R.jsx)(`span`,{style:{position:`absolute`,left:e.left,top:e.top,color:e.color,fontFamily:`'Arial Black', 'Impact', sans-serif`,fontSize:e.size,lineHeight:1,letterSpacing:0,textShadow:`0 0 16px rgba(255,255,255,0.92), 0 5px 0 rgba(7,11,34,0.42)`,transform:`rotate(${e.rotate}deg)`,animation:`hub-number-fly 620ms cubic-bezier(0.2, 0.9, 0.2, 1) ${e.delay}ms both`},children:e.value},`${e.value}-${t}`))]}),_&&d===`timing`&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`div`,{style:{position:`absolute`,left:`50%`,top:`50%`,width:260,height:260,borderRadius:`50%`,border:`5px solid rgba(255,232,112,0.86)`,boxShadow:`0 0 28px rgba(255,232,112,0.86), inset 0 0 48px rgba(255,88,132,0.38)`,animation:`hub-timing-ring 420ms ease-in-out infinite`}}),(0,R.jsx)(`div`,{style:{position:`absolute`,left:`50%`,top:`50%`,width:16,height:330,marginLeft:-8,marginTop:-165,borderRadius:999,background:`#ff5f87`,boxShadow:`0 0 20px rgba(255,95,135,0.95)`,transformOrigin:`50% 50%`,transform:`rotate(${l===`out`?-36:36}deg)`}}),(0,R.jsx)(`div`,{style:{position:`absolute`,left:`50%`,top:`50%`,width:560,height:14,marginLeft:-280,marginTop:-7,borderRadius:999,background:`linear-gradient(90deg, transparent, rgba(255,244,172,0.95), transparent)`,animation:`hub-timing-sweep 620ms cubic-bezier(0.2, 0.9, 0.2, 1) infinite`}}),(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#fff6b0`,fontFamily:`'Arial Black', 'Impact', sans-serif`,fontSize:70,letterSpacing:0,textShadow:`0 0 18px rgba(255,232,112,0.95), 0 7px 0 rgba(0,0,0,0.42)`},children:`TIMING!`})]})]})]})}function Nt({context:e,config:t,onExit:n}){let r=(0,a.useCallback)((r,i,a,o)=>{let s={flags:r,inventory:i,playerStats:e.playerStats};if(a.id===`__return__`){n(s);return}let c=Object.values(t.masterData.items).map(e=>({id:e.id,name:e.name,usable:e.usable,description:e.description,category:e.category})),l=a.config??{},u=typeof l.map==`string`?l.map:null,d=e=>{if(!(typeof e!=`string`||!e))try{return JSON.parse(e)}catch{return}},f=e=>{if(!(typeof e!=`string`||!e))try{let t=JSON.parse(e);return typeof t.x==`number`&&typeof t.y==`number`?{x:t.x,y:t.y}:void 0}catch{return}},p=e=>e===`N`||e===`E`||e===`S`||e===`W`?e:void 0,m=u?d(r[`maze_visited_${u}`]):void 0,h=u?d(r[`maze_triggered_${u}`]):void 0,g=u?d(r[`maze_opened_seals_${u}`]):void 0,_=u?d(r[`maze_opened_treasures_${u}`]):void 0,v=u?f(r[`maze_pos_${u}`]):void 0,y=u?p(r[`maze_dir_${u}`]):void 0,b=u&&typeof r[`maze_floor_${u}`]==`number`?r[`maze_floor_${u}`]:void 0,x={},S=(e,n)=>{if(typeof e!=`string`)return;let r=t.masterData.characters[e];if(!r)return;x[`${n}Name`]=r.name;let i=r.sprites?.normal??(r.sprites?Object.values(r.sprites)[0]:void 0);i&&(x[`${n}FaceImage`]=i),r.voicevox_speaker_id&&(x[`${n}VoicevoxSpeakerId`]=r.voicevox_speaker_id)};S(l.playerCharacterId,`player`),S(l.opponentCharacterId,`opponent`);let C={masterData:t.masterData,assetsBaseUrl:t.assetsBaseUrl,chapterId:o,initialLocationId:t.initialLocationId,chapters:t.chapters,exitSceneId:a.return_scene,gameoverSceneId:a.gameover_scene,gameoverBossSceneId:a.gameover_boss_scene,gameoverLandingSceneId:a.gameover_landing_scene};n(s,{engineId:a.id,transition:a.transition,config:{assetsBaseUrl:t.assetsBaseUrl,items:c,...x,...b===void 0?{}:{initialFloor:b},...v?{initialPos:v}:{},...y?{initialDir:y}:{},...m?{initialVisited:m}:{},...h?{initialTriggeredEvents:h}:{},...g?{initialOpenedSeals:g}:{},..._?{initialOpenedTreasures:_}:{},...a.config??{},_novelReturn:C},returnEngineId:a.return_scene?`novel`:void 0,returnConfig:a.return_scene?{...t,chapterId:o,initialSceneId:a.return_scene,autoStart:!0}:void 0})},[e.playerStats,t,n]);return(0,R.jsx)(St,{masterData:t.masterData,assetsBaseUrl:t.assetsBaseUrl,config:{initialSceneId:t.initialSceneId,initialLocationId:t.initialLocationId,chapterId:t.chapterId,chapters:t.chapters},initialFlags:e.flags,initialInventory:e.inventory,autoStart:t.autoStart,onEngineTransition:r})}var Pt={component:Nt},Ft={dungeon_01:[`###########`,`#S........#`,`#.#######.#`,`###.......#`,`###.#######`,`###.....###`,`#######.###`,`#######.###`,`#######.###`,`#######...#`,`#########X#`,`###########`],dungeon_02:[`###############`,`#S..........###`,`#.#########.###`,`###.........###`,`###.#######.###`,`###E#.........#`,`###.#.#########`,`###.#.........#`,`###.###########`,`###..........B#`,`#############X#`,`###############`],dungeon_03:[`###############`,`#S.....##.#####`,`#.#######.#####`,`#.#######.#####`,`#.#######.#####`,`#.###.#E......#`,`#.###.#.#####.#`,`#.###.#.#####.#`,`#.###.#.#####.#`,`#.......#####B#`,`#############X#`,`###############`],ichibangai_abyss_5f:[[`###############`,`#S..........r.#`,`#.n##########.#`,`#...........#.#`,`###########.#.#`,`#...........#.#`,`#.###########.#`,`#.............#`,`#.###########.#`,`#............D#`,`###############`],[`###############`,`#UR....E.....g#`,`#############.#`,`#...........#.#`,`###########.#.#`,`#...........#.#`,`#.###########.#`,`#.............#`,`#.###########.#`,`#............D#`,`###############`],[`###############`,`#UG...........#`,`#############.#`,`#...........#.#`,`###########.#.#`,`#...........#.#`,`#.###########.#`,`#.............#`,`#.###########.#`,`#............D#`,`###############`],[`###############`,`#U...........p#`,`#.h##########.#`,`#...........#.#`,`###########.#.#`,`#...........#.#`,`#.###########.#`,`#.............#`,`#.###########.#`,`#..........P.D#`,`###############`],[`###############`,`#U............#`,`#.###########.#`,`#.....#.......#`,`#####.#.#######`,`#.....#.......#`,`#.###########.#`,`#...........#.#`,`###########.#.#`,`#...........B.#`,`###############`]],ichibangai_abyss_final_13f:[[`###############`,`#S............#`,`#.###########.#`,`#.....#.......#`,`#####.#.#######`,`#.....#.......#`,`#.###########.#`,`#...........#.#`,`###########.#.#`,`#............D#`,`###############`],[`###############`,`#U............#`,`#.###########.#`,`#...........#.#`,`#.#########.#.#`,`#.#.......#.#.#`,`#.#.#####.#.#.#`,`#.#.....#.#...#`,`#.#####.#.#####`,`#.......#....D#`,`###############`],[`###############`,`#U..........#.#`,`#.#########.#.#`,`#....m....#...#`,`#########.#####`,`#.......#.....#`,`#.#####.#####.#`,`#.#...#.......#`,`#.#.#.#########`,`#...#........D#`,`###############`],[`###############`,`#U............#`,`#.###########.#`,`#.....#.......#`,`#####.#.#######`,`#.....#.......#`,`#.###########.#`,`#...........#.#`,`###########.#.#`,`#............D#`,`###############`],[`###############`,`#U....#.......#`,`#####.#.#####.#`,`#.....#.#...#.#`,`#.#####.#.#.#.#`,`#.......#.#.#.#`,`#########.#.#.#`,`#.........#...#`,`#.###########.#`,`#............D#`,`###############`],[`###############`,`#U............#`,`#.###########.#`,`#.#.........#.#`,`#.#.#######.#.#`,`#.#.....#...#.#`,`#.#####.#.###.#`,`#.....#.#.....#`,`#####.#.#######`,`#.....#......D#`,`###############`],[`###############`,`#U............#`,`#.###########.#`,`#.....#.......#`,`#####.#.#######`,`#.....#.......#`,`#.###########.#`,`#...........#.#`,`###########.###`,`#..........EB.#`,`###############`]]};function It(e){return{...e,maxHp:e.hp}}var W={ghost:{id:`ghost`,name:`ゴースト`,hp:10,atk:4,def:1},bat:{id:`bat`,name:`コウモリ`,hp:6,atk:3,def:0},wanderingFlame:{id:`wandering_flame`,name:`迷い火`,hp:8,atk:3,def:1},wraith:{id:`wraith`,name:`レイス`,hp:14,atk:5,def:2},skeleton:{id:`skeleton`,name:`スケルトン`,hp:16,atk:6,def:3},zombie:{id:`zombie`,name:`ゾンビ`,hp:20,atk:7,def:2},slime:{id:`slime`,name:`スライム`,hp:12,atk:5,def:1}},Lt={dungeon_02:[W.ghost,W.bat,W.wraith],dungeon_03:[W.ghost,W.bat,W.wraith],ichibangai_abyss_5f:[W.ghost,W.bat,W.wanderingFlame,W.wraith],ichibangai_abyss_final_13f:[W.skeleton,W.zombie,W.slime,W.wraith]},Rt={ichibangai_abyss_5f:{0:[W.ghost,W.bat,W.wanderingFlame],1:[W.ghost,W.bat,W.wanderingFlame],2:[W.ghost,W.bat,W.wanderingFlame,W.wraith],3:[W.ghost,W.bat,W.wanderingFlame,W.wraith],4:[W.ghost,W.bat,W.wanderingFlame,W.wraith]},ichibangai_abyss_final_13f:{0:[W.skeleton,W.slime,W.wraith],1:[W.skeleton,W.zombie,W.slime],2:[W.skeleton,W.zombie,W.wraith],3:[W.zombie,W.slime,W.wraith],4:[W.skeleton,W.zombie,W.slime,W.wraith],5:[W.skeleton,W.zombie,W.slime,W.wraith],6:[W.zombie,W.wraith]}},zt={dungeon_02:{id:`maze_boss`,name:`迷宮の主`,hp:22,atk:7,def:2},dungeon_03:{id:`maze_boss`,name:`迷宮の主`,hp:22,atk:7,def:2},ichibangai_abyss_5f:{id:`maze_boss`,name:`迷宮の主`,hp:22,atk:7,def:2},ichibangai_abyss_final_13f:{id:`abyss_boss`,name:`一番街の深淵`,hp:42,atk:10,def:4}},Bt={skeleton:{itemId:`item_small_ofuda`,itemName:`ちいさなおふだ`,rate:.35},zombie:{itemId:`item_onigiri`,itemName:`お握り`,rate:.35},slime:{itemId:`item_fushigi_candy`,itemName:`不思議なアメ`,rate:.35}};function Vt(e,t){let n=t??zt[e];return n?It(n):null}function Ht(e,t=0){let n=Rt[e]?.[t]??Lt[e];return!n||n.length===0?null:It(n[Math.floor(Math.random()*n.length)])}function Ut(e,t){let n=Bt[e];return!n||t.includes(n.itemId)||Math.random()>=n.rate?null:{itemId:n.itemId,itemName:n.itemName}}function Wt(e){let t=Ht(e.mapId,e.floor);if(!t)return e;let n={enemy:t,phase:`select`,log:[`${t.name} が現れた！`],cursorIndex:0,guarding:!1};return{...e,battle:n}}function Gt(e){let t=Vt(e.mapId,e.boss);if(!t)return e;let n={enemy:t,phase:`select`,log:[`${t.name} が立ちはだかった！　逃げられない！`],cursorIndex:0,guarding:!1};return{...e,battle:n}}function Kt(e){let{battle:t}=e;if(!t)return e;let n=Math.max(1,t.enemy.atk-(t.guarding?e.playerDef*2:e.playerDef)),r=e.playerHp-n,i=[...t.log,`${t.enemy.name} の攻撃！ ケン に ${n} ダメージ！`];return r<=0?{...e,playerHp:0,battle:{...t,phase:`lose`,log:[...i,`ケン は倒れた……`],guarding:!1}}:{...e,playerHp:r,battle:{...t,phase:`select`,log:i,guarding:!1}}}function qt(e){let{battle:t}=e;if(!t)return e;if(t.cursorIndex===3){if(e.pendingBossTilePos){let n=[...t.log,`逃げることはできない！`];return Kt({...e,battle:{...t,log:n,guarding:!1}})}if(Math.random()<.5)return{...e,battle:null};let n=[...t.log,`逃げられなかった！`];return Kt({...e,battle:{...t,log:n,guarding:!1}})}if(t.cursorIndex===1){let n=[...t.log,`ケン は身を守った！`];return Kt({...e,battle:{...t,log:n,guarding:!0}})}if(t.cursorIndex===2)return e;let n=Math.max(1,e.playerAtk-t.enemy.def),r=t.enemy.hp-n,i=[...t.log,`ケン の攻撃！ ${t.enemy.name} に ${n} ダメージ！`];if(r<=0){let n={...t.enemy,hp:0},r=Ut(t.enemy.id,e.inventory),a=r?[...e.inventory,r.itemId]:e.inventory,o=[...i,`${t.enemy.name} を倒した！`];return r&&o.push(`${r.itemName}を手に入れた！`),{...e,inventory:a,battle:{...t,enemy:n,phase:`win`,log:o,guarding:!1}}}let a={...t.enemy,hp:r};return Kt({...e,battle:{...t,enemy:a,log:i,guarding:!1}})}function Jt(e,t){let{battle:n}=e;if(!n)return e;let r=t===`Enter`||t===` `,i=t===`ArrowUp`||t===`w`||t===`W`,a=t===`ArrowDown`||t===`s`||t===`S`;if(n.phase===`select`)return i?{...e,battle:{...n,cursorIndex:(n.cursorIndex+3)%4}}:a?{...e,battle:{...n,cursorIndex:(n.cursorIndex+1)%4}}:r?qt(e):e;if(!r)return e;if(n.phase===`win`){if(e.pendingBossTilePos){let t=new Set(e.triggeredEvents);return t.add(e.pendingBossTilePos),{...e,battle:null,pendingBossTilePos:null,triggeredEvents:t,lastBossDefeated:!0}}return{...e,battle:null}}return n.phase===`lose`?{...e,pendingDeath:!0}:e}var Yt=.2,Xt={N:{fwd:{x:0,y:-1},left:{x:-1,y:0},right:{x:1,y:0},back:{x:0,y:1}},E:{fwd:{x:1,y:0},left:{x:0,y:-1},right:{x:0,y:1},back:{x:-1,y:0}},S:{fwd:{x:0,y:1},left:{x:1,y:0},right:{x:-1,y:0},back:{x:0,y:-1}},W:{fwd:{x:-1,y:0},left:{x:0,y:1},right:{x:0,y:-1},back:{x:1,y:0}}},Zt={N:`W`,W:`S`,S:`E`,E:`N`},Qt={N:`E`,E:`S`,S:`W`,W:`N`};function $t(e,t,n){return n<0||n>=e.length||t<0||t>=(e[n]?.length??0)?`#`:e[n][t]??`#`}function en(e){let t=Ft.dungeon_01,n=e??t;return typeof n[0]==`string`?[n]:n}function tn(e,t){return`${e}:${t.x},${t.y}`}function nn(e,t){return{x:e.x+t.x,y:e.y+t.y}}function rn(e,t){return{x:e.x*t,y:e.y*t}}function an(e){for(let t=0;t<e.length;t++){let n=e[t].indexOf(`S`);if(n>=0)return{x:n,y:t}}return{x:1,y:1}}function on(e,t,n,r){let i=en(Ft[e]),a=Math.max(0,Math.min(i.length-1,r?.initialFloor??0)),o=i[a]??i[0],s=r?.initialPos??an(o),c=r?.initialDir??`N`,l=t?.maxHp??20,u=Math.min(l,Math.max(1,t?.hp??l)),d=r?.initialVisited?new Set(r.initialVisited):new Set([tn(a,s)]),f=r?.initialTriggeredEvents?new Set(r.initialTriggeredEvents):new Set,p=r?.initialOpenedSeals?new Set(r.initialOpenedSeals):new Set,m=r?.initialOpenedTreasures?new Set(r.initialOpenedTreasures):new Set;return{pos:s,dir:c,map:o,floors:i,floor:a,mapId:e,boss:r?.boss,seals:r?.seals??{},treasures:r?.treasures??{},openedSeals:p,openedTreasures:m,visited:d,atExit:!1,steps:0,playerHp:u,playerMaxHp:l,playerAtk:t?.atk??5,playerDef:t?.def??2,battle:null,inventory:n??[],pendingEvent:null,triggeredEvents:f,pendingDeath:!1,pendingBossTilePos:null,lastBossDefeated:!1}}function sn(e,t,n,r){let i=e.inventory.indexOf(t);if(i===-1||r?.attackEnemy!==void 0&&!e.battle)return e;let a=[...e.inventory.slice(0,i),...e.inventory.slice(i+1)],o=[`${n}を使った！`],s=e.playerHp;if(r?.healHp===`full`?(s=e.playerMaxHp,o.push(`HPが全回復した！`)):typeof r?.healHp==`number`&&(s=Math.min(e.playerMaxHp,e.playerHp+r.healHp),o.push(`HPが ${r.healHp} 回復した！`)),e.battle&&r?.attackEnemy!==void 0){let t=e.battle.enemy,n=Math.min(r.attackEnemy,t.hp),i=Math.max(0,t.hp-r.attackEnemy);o.push(`${t.name} に ${n} の大ダメージ！`);let c={...t,hp:i};if(i<=0){let n=Ut(t.id,a),r=n?[...a,n.itemId]:a;return o.push(`${t.name} を倒した！`),n&&o.push(`${n.itemName}を手に入れた！`),{...e,inventory:r,playerHp:s,battle:{...e.battle,enemy:c,phase:`win`,log:[...e.battle.log,...o]}}}return{...e,inventory:a,playerHp:s,battle:{...e.battle,enemy:c,log:[...e.battle.log,...o]}}}if(e.battle){let t=[...e.battle.log,...o];return{...e,inventory:a,playerHp:s,battle:{...e.battle,log:t}}}return{...e,inventory:a,playerHp:s}}var cn=new Set([`.`,`S`,`X`,`#`,`U`,`D`]);function ln(e,t){for(let[n,r]of Object.entries(e.seals))if(r.doorTile===t)return n;return null}function un(e,t){for(let[n,r]of Object.entries(e.seals))if(r.switchTile===t)return n;return null}function dn(e,t){return tn(e,t)}function fn(e,t){return e.treasures[t]??null}function pn(e,t){return ln(e,t)!==null}function mn(e,t){return un(e,t)!==null}function hn(e,t){let n=ln(e,t);return n!==null&&e.openedSeals.has(n)}function gn(e,t){return fn(e,t)!==null}function _n(e,t,n){return e.openedTreasures.has(dn(t,n))}function vn(e,t,n){let r=$t(e.map,t,n);if(r===`#`)return!0;let i=ln(e,r);return!!(i!==null&&!e.openedSeals.has(i)||fn(e,r)&&!_n(e,e.floor,{x:t,y:n}))}function yn(e,t=1){let n=Xt[e.dir].fwd;return{x:e.pos.x+n.x*t,y:e.pos.y+n.y*t}}function bn(e){let t=yn(e),n=$t(e.map,t.x,t.y),r=fn(e,n);return!r||_n(e,e.floor,t)?null:{pos:t,tile:n,treasure:r}}function xn(e,t){let n=bn(e);if(!n)return e;let r=new Set(e.openedTreasures);r.add(dn(e.floor,n.pos));let i=[...e.inventory,n.treasure.itemId],a=n.treasure.label??t??n.treasure.itemId;return{...e,inventory:i,openedTreasures:r,lastNotice:`宝箱を開けた。${a}を手に入れた。`,lastTreasureOpened:n.tile}}function Sn(e,t,n){for(let n=0;n<e.length;n++){let r=e[n]?.indexOf(t)??-1;if(r>=0)return{x:r,y:n}}return n}function Cn(e){return $t(e.map,e.pos.x,e.pos.y)===`D`&&e.floor<e.floors.length-1?`down`:null}function wn(e){if(!Cn(e))return e;let t=e.floor+1,n=e.floors[t]??e.map,r=$t(n,e.pos.x,e.pos.y)===`U`?e.pos:Sn(n,`U`,e.pos),i=new Set(e.visited);return i.add(tn(t,r)),{...e,pos:r,map:n,floor:t,visited:i,atExit:$t(n,r.x,r.y)===`X`,steps:e.steps+1}}function Tn(e,t){let n=nn(e.pos,t),r=$t(e.map,n.x,n.y);if(vn(e,n.x,n.y))return e;let i=tn(e.floor,n),a=new Set(e.visited);a.add(i);let o=new Set(e.openedSeals),s=un(e,r),c,l;s&&!o.has(s)&&(o.add(s),c=`${e.seals[s]?.label??`霊符`}が光り、どこかの封印扉が開いた。`,l=s);let u=r===`X`,d={...e,pos:n,visited:a,openedSeals:o,lastNotice:c,lastSealOpened:l,atExit:u,steps:e.steps+1},f=`${n.x},${n.y}`;return s?d:!u&&r===`B`&&!e.triggeredEvents.has(i)&&!e.triggeredEvents.has(f)?Gt({...d,pendingBossTilePos:i}):!u&&!cn.has(r)&&r!==`B`&&!pn(e,r)&&!gn(e,r)&&!e.triggeredEvents.has(i)&&!e.triggeredEvents.has(f)?{...d,pendingEvent:r}:!u&&r!==`B`&&Lt[e.mapId]&&Math.random()<Yt?Wt(d):d}function En(e){return Tn(e,Xt[e.dir].fwd)}function Dn(e){return Tn(e,Xt[e.dir].back)}function On(e){return{...e,dir:Zt[e.dir]}}function kn(e){return{...e,dir:Qt[e.dir]}}function An(e,t){if(e.pendingDeath)return e;if(e.battle)return Jt(e,t);if(e.pendingEvent!==null||e.atExit)return e;switch(t){case`Enter`:case` `:return wn(e);case`ArrowUp`:case`w`:case`W`:return En(e);case`ArrowDown`:case`s`:case`S`:return Dn(e);case`ArrowLeft`:case`a`:case`A`:return On(e);case`ArrowRight`:case`d`:case`D`:return kn(e);default:return e}}function jn(e,t){let{fwd:n,left:r,right:i}=Xt[e.dir],a=[!1],o=[!1],s=[!1];for(let c=1;c<=t;c++){let t=nn(e.pos,rn(n,c));a.push(vn(e,t.x,t.y));let l=nn(e.pos,rn(n,c-1));o.push(vn(e,nn(l,r).x,nn(l,r).y)),s.push(vn(e,nn(l,i).x,nn(l,i).y))}return{front:a,left:o,right:s}}var G=480,K=320,Mn=4,Nn=[[0,0,480,320],[60,40,420,280],[120,80,360,240],[172,110,308,210],[207,128,273,192]],Pn=[1,1,.78,.56,.38];function Fn(e,t,n,r){return`rgb(${Math.round(e*r)},${Math.round(t*r)},${Math.round(n*r)})`}function In(e){let t=parseInt(e.replace(`#`,``),16);return[t>>16&255,t>>8&255,t&255]}function Ln(e){return Math.max(0,Math.min(1,e))}function q(e,t){let[n,r,i]=In(e);return`rgba(${n},${r},${i},${t})`}function Rn(e,t,n,r,i){let a=Ln(r.wallDamage);if(a<=.02)return;let[o,s,c,l]=t,u=c-o,d=l-s,[f,p,m]=In(r.wallStain),h=Math.max(.12,a*.36)/Math.max(1,n*.72),g=Math.max(1,Math.round(a*(i===`front`?7:4))),_=Math.max(1,Math.round(a*(i===`front`?5:3)));e.save(),e.beginPath(),e.rect(o,s,u,d),e.clip();for(let t=0;t<_;t++){let r=o+u*((.18+t*.23+n*.07)%.82),i=s+d*((.16+t*.31+n*.11)%.72),c=u*(.09+a*.12)/Math.max(1,n*.25),l=d*(.05+a*.09);e.fillStyle=`rgba(${f},${p},${m},${h})`,e.beginPath(),e.ellipse(r,i,c,l,t%2?-.35:.25,0,Math.PI*2),e.fill()}e.strokeStyle=`rgba(16,10,8,${Math.min(.62,.22+a*.48)})`,e.lineWidth=Math.max(1,a*2.4/n);for(let t=0;t<g;t++){let r=o+u*((.12+t*.19+n*.05)%.84),c=s+d*((.2+t*.29+n*.09)%.65),l=d*(.08+a*.13),f=u*(i===`right`?-.04:i===`left`?.04:.02);e.beginPath(),e.moveTo(r,c),e.lineTo(r+f,c+l*.45),e.lineTo(r-f*.55,c+l),a>.45&&(e.moveTo(r+f*.15,c+l*.48),e.lineTo(r+f*1.8,c+l*.7)),e.stroke()}if(a>.55){e.fillStyle=`rgba(235,220,180,${.05+a*.08})`;for(let t=0;t<10;t++){let r=o+u*((t*.17+n*.13)%1),i=s+d*((t*.23+n*.19)%1);e.fillRect(r,i,Math.max(1,u*.012),Math.max(1,d*.01))}}e.restore()}function zn(e,t,n){let{front:r,left:i,right:a}=jn(t,Mn),[o,s,c]=In(n.wallFront),[l,u,d]=In(n.wallSide),f=e.createLinearGradient(0,0,0,K/2);f.addColorStop(0,n.ceilTop),f.addColorStop(1,n.ceilBottom),e.fillStyle=f,e.fillRect(0,0,G,K/2);let p=e.createLinearGradient(0,K/2,0,K);p.addColorStop(0,n.floorTop),p.addColorStop(1,n.floorBottom),e.fillStyle=p,e.fillRect(0,K/2,G,K/2);let m=Mn;for(let e=1;e<=Mn;e++)if(r[e]){m=e;break}for(let t=m;t>=1;t--){let f=Pn[t]??.3,[p,m,h,g]=Nn[t],[_,v,y,b]=Nn[t-1];if(r[t]){e.fillStyle=Fn(o,s,c,f),e.fillRect(p,m,h-p,g-m),e.strokeStyle=`rgba(0,0,0,0.45)`,e.lineWidth=1;let r=Math.max(8,Math.floor((g-m)/3));for(let t=m+r;t<g;t+=r)e.beginPath(),e.moveTo(p,t),e.lineTo(h,t),e.stroke();let i=Math.floor((g-m)/r);for(let t=0;t<i;t++){let n=t%2*Math.floor((h-p)/4),i=Math.max(6,Math.floor((h-p)/3));for(let a=p+n;a<h;a+=i)e.beginPath(),e.moveTo(a,m+t*r),e.lineTo(a,m+(t+1)*r),e.stroke()}Rn(e,[p,m,h,g],t,n,`front`)}i[t]&&(e.fillStyle=Fn(l,u,d,f),e.beginPath(),e.moveTo(_,v),e.lineTo(p,m),e.lineTo(p,g),e.lineTo(_,b),e.closePath(),e.fill(),e.strokeStyle=Fn(l+20,u+15,d+5,f),e.lineWidth=1,e.beginPath(),e.moveTo(p,m),e.lineTo(p,g),e.stroke(),Rn(e,[_,v,p,b],t,n,`left`)),a[t]&&(e.fillStyle=Fn(l,u,d,f),e.beginPath(),e.moveTo(h,m),e.lineTo(y,v),e.lineTo(y,b),e.lineTo(h,g),e.closePath(),e.fill(),e.strokeStyle=Fn(l+20,u+15,d+5,f),e.lineWidth=1,e.beginPath(),e.moveTo(h,m),e.lineTo(h,g),e.stroke(),Rn(e,[h,v,y,b],t,n,`right`))}if(!r[m]&&m===Mn){let[t,r,i,a]=Nn[Mn];e.fillStyle=n.ceilTop,e.fillRect(t,r,i-t,a-r)}$t(t.map,t.pos.x,t.pos.y)===`D`&&Hn(e,0,n);for(let i=1;i<=Mn;i++){let a=yn(t,i),o=$t(t.map,a.x,a.y);if(o===`#`)break;if(o===`D`){Hn(e,i,n);break}if(gn(t,o)){_n(t,t.floor,a)||Un(e,i,o);break}if(r[i])break}}function Bn(e){let t=Math.round(26+e*42),n=Array.from({length:t},(t,n)=>{let r=(n*53+97)%251;return{bx:(r*37+n*61)%G,by:20+(r*17+n*29)%(K-40),depth:.25+r%100/100*.75,size:14+r%42,drift:10+r%38*e,speed:8+r%20,phase:n*.73,alpha:.035+e*.095}}),r=Math.round(7+e*11),i=Array.from({length:r},(t,n)=>{let r=n*79+41;return{by:34+r*19%(K-68),depth:.22+r%100/100*.78,length:130+r%170,thickness:4+r%10,speed:18+r%34,phase:r*.07,sway:14+r%28,alpha:.045+e*.105}}),a=Math.round(10+e*18);return{blobs:n,wisps:i,sparks:Array.from({length:a},(t,n)=>{let r=n*67+23;return{bx:(r*31+n*47)%G,by:28+r*11%(K-56),depth:.35+r%100/100*.65,speed:10+r%28,phase:r*.13,size:1.2+r%4*.55,alpha:.08+e*.18}})}}function Vn(e,t,n,r,i){e.clearRect(0,0,G,K),e.save();let a=.07+n*.19,o=.85+.15*Math.sin(r*.32),s=e.createRadialGradient(G/2,K*.42,30,G/2,K*.52,G*.72);s.addColorStop(0,q(t.mistColor,a*.95*o)),s.addColorStop(.48,q(t.mistColor,a*.45*o)),s.addColorStop(1,q(t.mistColor,0)),e.fillStyle=s,e.fillRect(0,0,G,K),e.restore(),e.save(),e.globalCompositeOperation=`screen`;for(let a of i.blobs){let i=a.depth,o=K+120,s=(a.by+r*a.speed*(.35+i)+Math.sin(r*.45+a.phase)*11+60)%o-60,c=.48+i*1.2,l=a.bx+Math.sin(r*.24+a.phase)*a.drift+(i-.5)*Math.sin(r*.11)*28,u=s,d=a.size*c*(1.15+n*.45),f=Math.max(3,a.size*.18*c),p=a.alpha*(.55+.45*Math.sin(r*.8+a.phase)),m=e.createRadialGradient(l,u,0,l,u,d);m.addColorStop(0,q(t.mistColor,p)),m.addColorStop(.58,q(t.mistColor,p*.35)),m.addColorStop(1,q(t.mistColor,0)),e.fillStyle=m,e.beginPath(),e.ellipse(l,u,d,f,Math.sin(r*.17+a.phase)*.18,0,Math.PI*2),e.fill()}for(let n of i.wisps){let i=n.depth,a=(r*n.speed+n.phase*80)%(G+n.length)-n.length/2,o=n.by+Math.sin(r*.55+n.phase)*n.sway*(.35+i),s=(i-.45)*46+Math.sin(r*.19+n.phase)*18,c=n.length*(.55+i),l=n.thickness*(.55+i*.9),u=n.alpha*(.62+.38*Math.sin(r*.7+n.phase)),d=e.createLinearGradient(a-c/2,o,a+c/2,o+s);d.addColorStop(0,q(t.mistColor,0)),d.addColorStop(.3,q(t.mistColor,u)),d.addColorStop(.7,q(t.mistColor,u*.65)),d.addColorStop(1,q(t.mistColor,0)),e.strokeStyle=d,e.lineWidth=l,e.lineCap=`round`,e.beginPath(),e.moveTo(a-c/2,o),e.quadraticCurveTo(a,o-16*i,a+c/2,o+s),e.stroke()}for(let n of i.sparks){let i=n.depth,a=((n.by-r*n.speed*(.45+i)+50)%(K+100)+(K+100))%(K+100)-50,o=n.bx+Math.sin(r*.5+n.phase)*18*i,s=.45+.55*Math.sin(r*1.8+n.phase),c=n.size*(.65+i);e.fillStyle=q(t.mistColor,n.alpha*s),e.beginPath(),e.arc(o,a,c,0,Math.PI*2),e.fill()}let c=n*(.08+.035*Math.sin(r*.9));e.strokeStyle=q(t.mistColor,c),e.lineWidth=2;for(let t=0;t<4;t++){let n=22+t*18+Math.sin(r*.7+t)*5;e.beginPath(),e.ellipse(G/2,K*.48,n*1.8,n*.5,r*.08+t*.35,.2,Math.PI*1.65),e.stroke()}e.restore()}function Hn(e,t,n){let[r,i,a,o]=t===0?Nn[1]:Nn[t]??Nn[Mn],s=t===0,c=(r+a)/2,l=K/2,u=s?K-22:o-(o-i)*.08,d=s?Math.max(l+30,K-94):o-(o-i)*.34,f=s?230:Math.max(34,(a-r)*.54),p=f*.42,m=f,h=Math.max(18,u-d),g=s?.92:Math.max(.38,.9/Math.max(1,t*.86));e.save(),e.globalAlpha=g,e.shadowColor=q(n.uiAccent,.65),e.shadowBlur=s?18:10/Math.max(1,t);let _=e.createLinearGradient(c,d,c,u);_.addColorStop(0,q(n.floorBottom,.25)),_.addColorStop(.35,`#05070d`),_.addColorStop(1,`#000000`),e.fillStyle=_,e.beginPath(),e.moveTo(c-p/2,d),e.lineTo(c+p/2,d),e.lineTo(c+m/2,u),e.lineTo(c-m/2,u),e.closePath(),e.fill(),e.shadowBlur=0,e.strokeStyle=q(n.uiAccent,s?.62:.42),e.lineWidth=Math.max(1,s?3:2/Math.max(1,t)),e.beginPath(),e.moveTo(c-p/2,d),e.lineTo(c-m/2,u),e.moveTo(c+p/2,d),e.lineTo(c+m/2,u),e.stroke();let v=s?6:Math.max(3,7-t);for(let t=1;t<=v;t++){let n=t/(v+1),r=d+h*n,i=p+(m-p)*n;e.strokeStyle=`rgba(180,225,255,${s?.44:.34})`,e.lineWidth=Math.max(1,s?2:1),e.beginPath(),e.moveTo(c-i/2,r),e.lineTo(c+i/2,r),e.stroke()}e.fillStyle=q(n.uiAccent,s?.16:.1),e.beginPath(),e.ellipse(c,d+h*.28,m*.22,h*.2,0,0,Math.PI*2),e.fill(),e.restore()}function Un(e,t,n){let[r,i,a,o]=Nn[t]??Nn[Mn],s=Math.max(.35,1.2-t*.2),c=(r+a)/2,l=o-(o-i)*.18,u=Math.max(28,(a-r)*.36*s),d=Math.max(20,(o-i)*.26*s),f=c-u/2,p=l-d,m=n===`h`?`#d8b4ff`:`#ffd36b`;e.save(),e.shadowColor=m,e.shadowBlur=16/t;let h=e.createLinearGradient(f,p,f,p+d*.45);h.addColorStop(0,`#a06a20`),h.addColorStop(1,`#4a2608`),e.fillStyle=h,e.beginPath(),e.moveTo(f+8*s,p+d*.42),e.quadraticCurveTo(c,p-d*.25,f+u-8*s,p+d*.42),e.lineTo(f+u-4*s,p+d*.58),e.lineTo(f+4*s,p+d*.58),e.closePath(),e.fill();let g=e.createLinearGradient(f,p+d*.4,f,p+d);g.addColorStop(0,`#7b3f10`),g.addColorStop(1,`#2a1204`),e.fillStyle=g,e.fillRect(f,p+d*.42,u,d*.58),e.shadowBlur=0,e.strokeStyle=`#f0c060`,e.lineWidth=Math.max(1,3/t),e.strokeRect(f+u*.08,p+d*.48,u*.84,d*.44),e.fillStyle=m,e.fillRect(c-u*.08,p+d*.5,u*.16,d*.22),e.fillStyle=`#1a0802`,e.fillRect(c-u*.035,p+d*.56,u*.07,d*.08),e.fillStyle=`rgba(255,235,160,0.85)`,e.beginPath(),e.arc(f+u*.2,p+d*.62,Math.max(2,4/t),0,Math.PI*2),e.arc(f+u*.8,p+d*.62,Math.max(2,4/t),0,Math.PI*2),e.fill(),e.restore()}var Wn={ceilTop:`#020213`,ceilBottom:`#0d0d25`,floorTop:`#130a02`,floorBottom:`#060300`,wallFront:`#9a7420`,wallSide:`#5a420a`,uiBg:`#080504`,uiAccent:`#ccaa66`,uiBorder:`#443322`,wallDamage:0,wallStain:`#1b1208`,mistColor:`#d8e8ff`,mistDensity:0};function Gn({state:e,theme:t}){let n=(0,a.useRef)(null),r=(0,a.useRef)(null),i=(0,a.useRef)(null),o=t??Wn;(0,a.useEffect)(()=>{let t=n.current?.getContext(`2d`);t&&zn(t,e,o)},[e,o]);let s=Math.max(0,Math.min(1,o.mistDensity)),c=(0,a.useMemo)(()=>Bn(s),[s]);return(0,a.useEffect)(()=>{if(s<=.01){(r.current?.getContext(`2d`))?.clearRect(0,0,G,K);return}let e=r.current;if(!e)return;let t=e.getContext(`2d`);if(!t)return;let n=performance.now();function a(e){Vn(t,o,s,(e-n)/1e3,c),i.current=requestAnimationFrame(a)}return i.current=requestAnimationFrame(a),()=>{i.current!==null&&cancelAnimationFrame(i.current)}},[o,s,c]),(0,R.jsxs)(`div`,{style:{position:`relative`,width:G,height:K,display:`block`},children:[(0,R.jsx)(`canvas`,{ref:n,width:G,height:K,style:{display:`block`,imageRendering:`pixelated`}}),(0,R.jsx)(`canvas`,{ref:r,width:G,height:K,style:{position:`absolute`,top:0,left:0,pointerEvents:`none`,imageRendering:`pixelated`}})]})}var J=10,Kn=3,qn={N:[[0,-5],[-4,4],[4,4]],E:[[5,0],[-4,-4],[-4,4]],S:[[0,5],[-4,-4],[4,-4]],W:[[-5,0],[4,-4],[4,4]]};function Jn({state:e,mode:t=`full`}){let n=(0,a.useRef)(null),r=e.map[0]?.length??0,i=e.map.length,o=r*J+Kn*2,s=i*J+Kn*2;return(0,a.useEffect)(()=>{let a=n.current?.getContext(`2d`);if(!a)return;a.clearRect(0,0,o,s),a.fillStyle=`#0a0a0a`,a.fillRect(0,0,o,s);for(let n=0;n<i;n++)for(let i=0;i<r;i++){let r=e.map[n]?.[i]??`#`,o=`${e.floor}:${i},${n}`,s=`${i},${n}`,c=e.visited.has(o)||e.visited.has(s),l=Kn+i*J,u=Kn+n*J;if(t===`visited`&&!c){a.fillStyle=`#050505`,a.fillRect(l,u,J,J);continue}let d=pn(e,r)&&!hn(e,r),f=gn(e,r)&&!_n(e,e.floor,{x:i,y:n});r===`#`||d||f?(a.fillStyle=c?`#554433`:`#2a1a0a`,a.fillRect(l,u,J,J),f&&(a.fillStyle=c?`#d7a738`:`#735018`,a.fillRect(l+2,u+3,J-4,J-5),a.fillStyle=`#fff0a0`,a.fillRect(l+4,u+4,J-8,1))):(a.fillStyle=c?`#443322`:`#110a04`,a.fillRect(l,u,J,J),r===`X`?(a.fillStyle=`#33bb55`,a.fillRect(l+2,u+2,J-4,J-4)):r===`D`?(a.fillStyle=`#55aaff`,a.fillRect(l+2,u+2,J-4,J-4)):mn(e,r)?(a.fillStyle=`#ffdd66`,a.fillRect(l+2,u+2,J-4,J-4)):pn(e,r)?(a.fillStyle=`#b580ff`,a.fillRect(l+2,u+2,J-4,J-4)):gn(e,r)&&(a.fillStyle=`#6b4a20`,a.fillRect(l+3,u+4,J-6,J-6)))}let c=Kn+e.pos.x*J+J/2,l=Kn+e.pos.y*J+J/2,u=qn[e.dir]??qn.N;a.fillStyle=`#ffdd00`,a.beginPath(),a.moveTo(c+u[0][0],l+u[0][1]),a.lineTo(c+u[1][0],l+u[1][1]),a.lineTo(c+u[2][0],l+u[2][1]),a.closePath(),a.fill()},[e,o,s,i,r,t]),(0,R.jsx)(`canvas`,{ref:n,width:o,height:s,style:{display:`block`,imageRendering:`pixelated`}})}var Yn=[`攻撃`,`防御`,`アイテム`,`逃げる`];function Xn({hp:e,maxHp:t,color:n}){return(0,R.jsx)(`div`,{style:{height:8,background:`#2a2020`,borderRadius:4,overflow:`hidden`},children:(0,R.jsx)(`div`,{style:{width:`${Math.max(0,Math.min(1,t>0?e/t:0))*100}%`,height:`100%`,background:n,transition:`width 0.2s`,borderRadius:4}})})}function Zn({label:e,active:t,font:n,theme:r,onHover:i,onClick:o}){let[s,c]=(0,a.useState)(!1),l=t||s;return(0,R.jsx)(`div`,{onMouseEnter:()=>{c(!0),i()},onMouseLeave:()=>c(!1),onClick:o,style:{flex:1,fontSize:13,padding:`8px 0`,background:l?r.uiBorder:`#1a1008`,color:r.uiAccent,border:`1px solid ${l?r.uiAccent:r.uiBorder}`,borderRadius:3,cursor:`pointer`,userSelect:`none`,textAlign:`center`,fontFamily:n,transition:`background 0.1s, border-color 0.1s`},children:e})}function Qn({state:e,theme:t,onSelectCommand:n,onCommand:r,font:i}){let{battle:a}=e;if(!a)return null;let o=a.log.at(-1),s=(a.phase===`win`?a.log.find(e=>e.endsWith(`を手に入れた！`)):void 0)?.replace(`を手に入れた！`,``);return(0,R.jsxs)(`div`,{style:{width:`100%`,display:`flex`,flexDirection:`column`,gap:8,flexShrink:0,fontFamily:i},children:[(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,fontSize:11,marginBottom:4,color:t.uiAccent},children:[(0,R.jsx)(`span`,{children:a.enemy.name}),(0,R.jsxs)(`span`,{style:{opacity:.65},children:[`HP `,a.enemy.hp,`/`,a.enemy.maxHp]})]}),(0,R.jsx)(Xn,{hp:a.enemy.hp,maxHp:a.enemy.maxHp,color:`#e05050`})]}),a.phase===`select`?(0,R.jsx)(`div`,{style:{display:`flex`,gap:6},children:Yn.map((e,o)=>(0,R.jsx)(Zn,{label:e,active:a.cursorIndex===o,font:i,theme:t,onHover:()=>n?.(o),onClick:()=>{n?.(o),r?.(o)}},e))}):a.phase===`win`?(0,R.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,R.jsx)(`div`,{style:{fontSize:12,color:`#d8b8ff`,opacity:.95,userSelect:`none`,textShadow:`0 0 8px rgba(180,120,255,0.65)`},children:`撃破！`}),s&&(0,R.jsxs)(`div`,{style:{position:`relative`,overflow:`hidden`,border:`1px solid #f4d37a`,borderRadius:4,background:`linear-gradient(135deg, rgba(92,47,8,0.96), rgba(26,9,2,0.98))`,boxShadow:`0 0 20px rgba(244,186,74,0.35), inset 0 0 18px rgba(255,224,154,0.13)`,padding:`8px 10px`,color:`#ffe8aa`,animation:`maze-item-drop-card 820ms ease-out both`},children:[(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,background:`linear-gradient(90deg, transparent, rgba(255,245,190,0.28), transparent)`,transform:`translateX(-100%)`,animation:`maze-item-drop-shine 1200ms ease-out 80ms both`,pointerEvents:`none`}}),(0,R.jsx)(`div`,{style:{fontSize:10,letterSpacing:`0.12em`,color:`#f6c45f`,marginBottom:3},children:`ITEM GET`}),(0,R.jsx)(`div`,{style:{fontSize:15,lineHeight:1.25,textShadow:`0 0 8px rgba(255,220,120,0.55)`},children:s}),(0,R.jsx)(`div`,{style:{fontSize:10,marginTop:3,opacity:.72},children:`持ち物に入りました`})]})]}):(0,R.jsx)(`div`,{style:{fontSize:12,color:`#ff9090`,opacity:.95,userSelect:`none`},children:`倒れてしまった……`}),(0,R.jsxs)(`div`,{style:{borderTop:`1px solid ${t.uiBorder}`,paddingTop:6},children:[o&&(0,R.jsx)(`div`,{style:{fontSize:13,lineHeight:1.5,marginBottom:5,color:`#f3dfaa`,textShadow:`0 0 6px rgba(204,170,102,0.35)`},children:o}),(0,R.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:2,maxHeight:74,overflow:`hidden`,background:`rgba(0,0,0,0.18)`,border:`1px solid ${t.uiBorder}`,borderRadius:3,padding:`5px 6px`},children:a.log.slice(-5).map((e,t,n)=>(0,R.jsx)(`div`,{style:{fontSize:11,lineHeight:1.35,opacity:.36+(t+1)/n.length*.5},children:e},`${e}-${t}`))})]})]})}function $n({enemy:e,assetsBaseUrl:t,defeated:n=!1,onClick:r}){let[i,o]=(0,a.useState)(!1),s=e.maxHp>0?e.hp/e.maxHp:1,c=.4+s*.6,l=`${t}/enemies/${e.id}.png`,u=e.id===`maze_boss`||e.id===`abyss_boss`,d=er(e.id,u);return(0,R.jsxs)(`div`,{style:{position:`absolute`,inset:0,display:`flex`,alignItems:`center`,justifyContent:`center`,pointerEvents:`none`},children:[i&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`div`,{"aria-hidden":`true`,onClick:r&&!n?r:void 0,style:{position:`absolute`,width:u?250:174,height:u?270:188,clipPath:d.shape,background:d.body,opacity:c*.76,boxShadow:u?`0 0 34px rgba(210,60,120,0.72)`:`0 0 24px rgba(190,210,255,0.32)`,transform:n?`scale(1.18) rotate(-3deg)`:void 0,transition:`opacity 0.5s, transform 0.45s`,pointerEvents:r&&!n?`auto`:`none`,cursor:r&&!n?`crosshair`:`default`}}),(0,R.jsx)(`div`,{"aria-hidden":`true`,style:{position:`absolute`,width:u?112:70,height:u?82:54,background:d.core,backgroundSize:e.id===`skeleton`?`50% 100%`:void 0,backgroundPosition:e.id===`skeleton`?`0 0, 100% 0`:void 0,backgroundRepeat:`no-repeat`,opacity:c*.72,color:`rgba(255,255,255,0.55)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:u?46:28,fontFamily:`serif`,textShadow:`0 0 10px rgba(255,255,255,0.55)`,pointerEvents:`none`},children:d.mark})]}),(0,R.jsx)(`img`,{src:l,alt:e.name,style:{position:`relative`,display:i?`none`:`block`,maxHeight:u?330:270,maxWidth:u?360:270,objectFit:`contain`,opacity:c,transition:`opacity 0.5s, transform 0.45s, filter 0.45s`,imageRendering:`pixelated`,transform:n?`scale(1.18) rotate(-3deg)`:void 0,pointerEvents:r&&!n?`auto`:`none`,cursor:r&&!n?`crosshair`:`default`,filter:n?`brightness(2.3) saturate(0) blur(2px) drop-shadow(0 0 28px rgba(220,180,255,0.95))`:u?`drop-shadow(0 0 18px rgba(200,0,0,${.3+s*.5}))`:void 0},title:r&&!n?`${e.name}を攻撃`:void 0,onClick:r,onError:()=>o(!0)}),n&&(0,R.jsx)(`div`,{style:{position:`absolute`,width:u?360:250,height:u?300:210,borderRadius:`50%`,background:`radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(180,120,255,0.5) 26%, transparent 68%)`,mixBlendMode:`screen`,animation:`maze-enemy-burst 650ms ease-out forwards`}})]})}function er(e,t){return e===`skeleton`?{body:`linear-gradient(180deg, rgba(235,235,220,0.92), rgba(120,120,110,0.78))`,core:`radial-gradient(circle, rgba(40,40,35,0.92) 0 18%, transparent 20%), radial-gradient(circle, rgba(40,40,35,0.92) 0 18%, transparent 20%)`,shape:`polygon(50% 0%, 76% 22%, 68% 55%, 88% 100%, 50% 82%, 12% 100%, 32% 55%, 24% 22%)`,mark:`☠`}:e===`zombie`?{body:`linear-gradient(180deg, rgba(115,145,95,0.96), rgba(45,65,38,0.86))`,core:`radial-gradient(circle, rgba(145,30,45,0.8) 0 12%, transparent 14%)`,shape:`polygon(43% 0%, 70% 8%, 88% 42%, 78% 100%, 50% 86%, 20% 100%, 10% 42%)`,mark:`Z`}:e===`slime`?{body:`radial-gradient(circle at 44% 32%, rgba(180,255,220,0.95), rgba(40,180,135,0.82) 42%, rgba(8,64,52,0.88))`,core:`radial-gradient(circle, rgba(255,255,255,0.85) 0 12%, transparent 14%)`,shape:`ellipse(48% 42% at 50% 58%)`,mark:`●`}:{body:t?`radial-gradient(circle, rgba(120,0,30,0.95), rgba(25,0,18,0.9) 64%, rgba(0,0,0,0.7))`:`radial-gradient(circle, rgba(100,80,140,0.88), rgba(10,8,25,0.82))`,core:`radial-gradient(circle, rgba(255,210,255,0.85) 0 10%, transparent 12%)`,shape:`ellipse(42% 48% at 50% 50%)`,mark:t?`怨`:`影`}}function tr(e){if(!e)return`迷路内で特別な効果はない`;let t=[];return e.healHp===`full`?t.push(`HP全回復`):typeof e.healHp==`number`&&t.push(`HP+${e.healHp}`),typeof e.attackEnemy==`number`&&t.push(`敵に${e.attackEnemy}ダメージ`),e.escapeToNovelScene&&t.push(`迷宮から一時脱出`),t.length>0?t.join(` / `):`迷路内で特別な効果はない`}function nr(e){switch(e){case`key_item`:return`大事なもの`;case`consumable`:return`消耗品`;case`tool`:return`道具`;case`misc`:return`その他`;default:return`アイテム`}}function rr(e,t,n){return e?.usable===!1||!e?.usable&&!t?{canUse:!1,reason:`使用できない`}:n===`explore`&&t?.attackEnemy!==void 0?{canUse:!1,reason:`戦闘中のみ使用可`}:n===`battle`&&t?.escapeToNovelScene?{canUse:!1,reason:`戦闘中は使用不可`}:n===`battle`&&!t?.healHp&&t?.attackEnemy===void 0?{canUse:!1,reason:`戦闘中は効果なし`}:{canUse:!0,reason:`使用可能`}}function ir({name:e,selected:t,usable:n,count:r,theme:i,font:a,onSelect:o}){return(0,R.jsxs)(`button`,{type:`button`,onClick:o,style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,width:`100%`,fontSize:12,minHeight:30,padding:`6px 8px`,borderRadius:3,cursor:`pointer`,background:t?i.uiBorder:`transparent`,border:`1px solid ${t?i.uiAccent:i.uiBorder}`,color:n?i.uiAccent:i.uiBorder,opacity:n?1:.55,fontFamily:a,userSelect:`none`,transition:`background 0.12s, border-color 0.12s`},children:[(0,R.jsx)(`span`,{style:{overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:e}),(0,R.jsx)(`span`,{style:{fontSize:10,opacity:.65,flexShrink:0,marginLeft:6},children:r>1?`x${r}`:``})]})}function ar({inventory:e,itemDefs:t,theme:n,mode:r,expanded:i=!1,itemEffects:a,selectedItemId:o,onSelect:s,onUse:c,onClose:l,notification:u,font:d}){let f=new Map(t.map(e=>[e.id,e])),p=new Map;for(let t of e)p.set(t,(p.get(t)??0)+1);let m=[...p.keys()].filter(e=>f.get(e)?.usable===!0?!0:!!a?.[e]),h=o&&p.has(o)?o:null,g=h?f.get(h):void 0,_=g?.name??h??``,v=h?a?.[h]:void 0,y=rr(g,v,r);return(0,R.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,minHeight:0,flex:1},children:[(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:8,borderTop:`1px solid ${n.uiBorder}`,paddingTop:8,flexShrink:0,fontSize:10,color:n.uiBorder,letterSpacing:`0.08em`,fontFamily:d},children:[(0,R.jsxs)(`div`,{children:[`アイテム`,(0,R.jsx)(`span`,{style:{marginLeft:8,color:n.uiAccent,opacity:.7},children:r===`battle`?`戦闘中`:`探索中`})]}),l&&(0,R.jsx)(`button`,{type:`button`,onClick:l,style:{flexShrink:0,border:`1px solid ${n.uiBorder}`,background:`transparent`,color:n.uiAccent,borderRadius:3,padding:`4px 10px`,cursor:`pointer`,fontFamily:d,fontSize:11},children:`戻る`})]}),u&&(0,R.jsx)(`div`,{style:{fontSize:11,color:n.uiAccent,padding:`3px 6px`,background:`${n.uiBorder}55`,borderRadius:3,fontFamily:d,flexShrink:0},children:u}),m.length===0?(0,R.jsx)(`div`,{style:{fontSize:11,color:n.uiBorder,opacity:.4,padding:`2px 4px`,fontFamily:d},children:`持ち物なし`}):(0,R.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:3,flex:i?`1 1 120px`:`1 1 80px`,minHeight:i?80:56,overflow:`auto`,paddingRight:2},children:m.map(e=>{let t=f.get(e),i=a?.[e],o=rr(t,i,r);return(0,R.jsx)(ir,{name:t?.name??e,selected:h===e,usable:o.canUse,count:p.get(e)??1,theme:n,font:d,onSelect:()=>s(e)},e)})}),(0,R.jsx)(`div`,{style:{flex:i?`0 1 190px`:`0 1 150px`,minHeight:0,border:`1px solid ${n.uiBorder}`,borderRadius:3,background:`rgba(0,0,0,0.18)`,padding:`7px 8px`,fontFamily:d,display:`flex`,flexDirection:`column`,gap:6,overflow:`hidden`},children:h?(0,R.jsxs)(R.Fragment,{children:[(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,gap:8,alignItems:`baseline`,flexShrink:0},children:[(0,R.jsx)(`strong`,{style:{color:n.uiAccent,fontSize:13,fontWeight:700},children:_}),(0,R.jsxs)(`span`,{style:{color:n.uiBorder,fontSize:10,whiteSpace:`nowrap`},children:[nr(g?.category),` `,p.get(h)>1?`x${p.get(h)}`:``]})]}),(0,R.jsx)(`div`,{style:{color:`#e8d5aa`,fontSize:11,lineHeight:1.45,flex:1,minHeight:0,overflow:`auto`,paddingRight:2},children:g?.description??`説明はない。`}),(0,R.jsxs)(`div`,{style:{color:n.uiAccent,fontSize:11,opacity:.85,flexShrink:0},children:[`効果: `,tr(v)]}),(0,R.jsxs)(`div`,{style:{display:`flex`,gap:6,alignItems:`center`,flexShrink:0,marginTop:`auto`},children:[(0,R.jsx)(`button`,{type:`button`,disabled:!y.canUse,onClick:()=>c(h,_),style:{flex:`0 0 76px`,padding:i?`8px 0`:`6px 0`,borderRadius:3,border:`1px solid ${y.canUse?n.uiAccent:n.uiBorder}`,background:y.canUse?n.uiBorder:`transparent`,color:y.canUse?n.uiAccent:n.uiBorder,cursor:y.canUse?`pointer`:`default`,fontFamily:d,fontSize:12},children:`使う`}),(0,R.jsx)(`span`,{style:{color:y.canUse?n.uiAccent:n.uiBorder,fontSize:10,opacity:.8},children:y.reason})]})]}):(0,R.jsx)(`div`,{style:{color:n.uiBorder,opacity:.55,fontSize:11,lineHeight:1.5},children:`アイテムを選ぶと、説明と効果を確認できます。`})})]})}var or={ceilTop:`#020213`,ceilBottom:`#0d0d25`,floorTop:`#130a02`,floorBottom:`#060300`,wallFront:`#9a7420`,wallSide:`#5a420a`,uiBg:`#080504`,uiAccent:`#ccaa66`,uiBorder:`#443322`,wallDamage:0,wallStain:`#1b1208`,mistColor:`#d8e8ff`,mistDensity:0};function sr(e){return e?{...or,...e}:or}function cr(e){let t=e+1;return[String(t),`${t}F`,`B${t}F`,String(e)]}function lr(e,t,n){let r=cr(n).map(e=>t?.[e]).find(e=>!!e);return sr({...e,...r})}function ur(e,t,n){return{[`maze_pos_${e}`]:JSON.stringify(t),[`maze_dir_${e}`]:n}}var Y=`'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif`,dr={N:`北`,E:`東`,S:`南`,W:`西`};function fr(e,t){let n=(e.floorLabelStart??1)+t;return`${e.floorLabelPrefix??`B`}${n}F`}function pr(){let e=()=>Math.min(1,Math.min(window.innerWidth/800,window.innerHeight/600)),[t,n]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let t=()=>n(e());return window.addEventListener(`resize`,t),()=>window.removeEventListener(`resize`,t)},[]),t}function mr(e,t,n,r,i,o){let s=o&&r?r:i&&n?n:t;(0,a.useEffect)(()=>{if(!s)return;let t=`${e.replace(/\/$/,``)}/${s}`,n=new Audio(t);return n.loop=!0,n.volume=.6,n.play().catch(()=>{}),()=>{n.pause(),n.currentTime=0}},[s,e])}function hr(e,t){return e.weakenedBoss&&e.weakenedBossFlag&&t[e.weakenedBossFlag]===!0?e.weakenedBoss:e.boss}function gr(e,t){let n=e.boostedStatStages?.filter(e=>t.flags[e.flag]===!0).at(-1);return n?{...t.playerStats,...n.stats}:e.boostedPlayerStats&&e.boostedStatsFlag&&t.flags[e.boostedStatsFlag]===!0?{...t.playerStats,...e.boostedPlayerStats}:t.playerStats}function _r({hp:e,maxHp:t,theme:n}){let r=Math.max(0,Math.min(1,t>0?e/t:0)),i=r>.5?`#50c050`:r>.25?`#c0a020`:`#e03030`;return(0,R.jsxs)(`div`,{children:[(0,R.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,fontSize:11,marginBottom:4,color:n.uiAccent},children:[(0,R.jsx)(`span`,{style:{letterSpacing:`0.06em`},children:`HP`}),(0,R.jsxs)(`span`,{style:{opacity:.8},children:[e,` / `,t]})]}),(0,R.jsx)(`div`,{style:{height:6,background:`#2a2020`,borderRadius:3,overflow:`hidden`},children:(0,R.jsx)(`div`,{style:{width:`${r*100}%`,height:`100%`,background:i,transition:`width 0.3s`,borderRadius:3}})})]})}function vr(){return(0,R.jsxs)(`div`,{"aria-hidden":`true`,style:{position:`absolute`,inset:0,pointerEvents:`none`,overflow:`hidden`,zIndex:6},children:[(0,R.jsx)(`div`,{style:{position:`absolute`,left:`50%`,top:`56%`,width:250,height:120,borderRadius:`50%`,background:`radial-gradient(ellipse, rgba(180,255,190,0.45) 0%, rgba(120,255,170,0.16) 45%, transparent 72%)`,boxShadow:`0 0 36px rgba(150,255,190,0.6)`,transform:`translate(-50%, -50%)`,animation:`maze-heal-aura 900ms ease-out forwards`}}),[{left:`22%`,top:`62%`,delay:`0ms`,size:8},{left:`33%`,top:`36%`,delay:`90ms`,size:5},{left:`46%`,top:`68%`,delay:`170ms`,size:7},{left:`57%`,top:`32%`,delay:`40ms`,size:6},{left:`70%`,top:`56%`,delay:`130ms`,size:9},{left:`39%`,top:`48%`,delay:`230ms`,size:5},{left:`62%`,top:`72%`,delay:`280ms`,size:6}].map((e,t)=>(0,R.jsx)(`span`,{style:{position:`absolute`,left:e.left,top:e.top,width:e.size,height:e.size,transform:`translate(-50%, -50%) rotate(45deg)`,background:`#f4ffe1`,boxShadow:`0 0 10px #d8ff95, 0 0 18px rgba(120,255,170,0.9)`,animation:`maze-heal-sparkle 780ms ease-out ${e.delay} forwards`,opacity:0}},t))]})}function yr(e){switch(e){case`red`:return`#ff6b6b`;case`green`:return`#66f08a`;case`purple`:return`#c080ff`;default:return`#ffd86b`}}function br({sealId:e,label:t}){let n=yr(e),r=t??`霊符`;return(0,R.jsxs)(`div`,{"aria-hidden":`true`,style:{position:`absolute`,inset:0,pointerEvents:`none`,overflow:`hidden`,zIndex:7,display:`flex`,alignItems:`center`,justifyContent:`center`,fontFamily:Y},children:[(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,background:`radial-gradient(circle at center, ${n}55 0%, ${n}22 25%, transparent 58%)`,animation:`maze-seal-screen-flash 1150ms ease-out forwards`}}),[0,1,2].map(e=>(0,R.jsx)(`div`,{style:{position:`absolute`,width:92+e*34,height:92+e*34,borderRadius:`50%`,border:`2px solid ${n}`,boxShadow:`0 0 18px ${n}`,animation:`maze-seal-ring 1050ms ease-out ${e*90}ms forwards`,opacity:0}},e)),(0,R.jsxs)(`div`,{style:{position:`relative`,width:118,height:156,borderRadius:6,border:`2px solid ${n}`,background:`linear-gradient(180deg, rgba(255,255,230,0.94), ${n}33)`,boxShadow:`0 0 28px ${n}, inset 0 0 22px ${n}55`,color:n,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,gap:8,animation:`maze-seal-card 1150ms ease-out forwards`},children:[(0,R.jsx)(`div`,{style:{fontSize:42,fontWeight:700,lineHeight:1},children:`封`}),(0,R.jsx)(`div`,{style:{fontSize:12,color:`#201020`,fontWeight:700,letterSpacing:`0.08em`},children:r}),(0,R.jsx)(`div`,{style:{position:`absolute`,left:14,right:14,top:18,height:2,background:n}}),(0,R.jsx)(`div`,{style:{position:`absolute`,left:14,right:14,bottom:18,height:2,background:n}})]}),[...Array(14)].map((e,t)=>{let r=t/14*Math.PI*2,i=Math.cos(r)*140,a=Math.sin(r)*92;return(0,R.jsx)(`span`,{style:{position:`absolute`,width:8,height:8,background:n,boxShadow:`0 0 12px ${n}`,transform:`translate(-50%, -50%) rotate(45deg)`,animation:`maze-seal-spark 900ms ease-out ${t*28}ms forwards`,"--seal-x":`${i}px`,"--seal-y":`${a}px`,opacity:0}},t)})]})}function xr({itemName:e}){return(0,R.jsxs)(`div`,{"aria-hidden":`true`,style:{position:`absolute`,inset:0,pointerEvents:`none`,overflow:`hidden`,zIndex:8,display:`flex`,alignItems:`center`,justifyContent:`center`,fontFamily:Y},children:[(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,background:`radial-gradient(circle at center, rgba(255,218,112,0.34) 0%, rgba(255,170,60,0.14) 34%, transparent 66%)`,animation:`maze-item-get-screen 1450ms ease-out forwards`}}),[0,1,2,3,4,5].map(e=>(0,R.jsx)(`span`,{style:{position:`absolute`,left:`${24+e*10}%`,top:`${34+e%2*30}%`,width:8+e%3*3,height:8+e%3*3,background:`#fff2b8`,boxShadow:`0 0 14px rgba(255,230,140,0.95)`,transform:`rotate(45deg)`,animation:`maze-item-get-spark 1250ms ease-out ${e*80}ms forwards`,opacity:0}},e)),(0,R.jsxs)(`div`,{style:{position:`relative`,width:236,minHeight:128,borderRadius:6,border:`2px solid #f4d37a`,background:`linear-gradient(145deg, rgba(70,34,7,0.98), rgba(20,8,2,0.98))`,boxShadow:`0 0 32px rgba(244,186,74,0.58), inset 0 0 22px rgba(255,224,154,0.18)`,color:`#ffe8aa`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,gap:7,padding:`18px 20px`,overflow:`hidden`,textAlign:`center`,animation:`maze-item-get-card 1450ms ease-out forwards`},children:[(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,background:`linear-gradient(90deg, transparent, rgba(255,248,194,0.36), transparent)`,transform:`translateX(-100%)`,animation:`maze-item-get-shine 1400ms ease-out 120ms forwards`}}),(0,R.jsx)(`div`,{style:{position:`relative`,fontSize:11,color:`#f6c45f`,letterSpacing:`0.14em`},children:`ITEM GET`}),(0,R.jsx)(`div`,{style:{position:`relative`,fontSize:28,lineHeight:1,color:`#fff2c2`,textShadow:`0 0 16px rgba(255,220,120,0.72)`},children:`宝`}),(0,R.jsx)(`div`,{style:{position:`relative`,fontSize:17,lineHeight:1.3,maxWidth:196,overflowWrap:`anywhere`},children:e}),(0,R.jsx)(`div`,{style:{position:`relative`,fontSize:11,opacity:.72},children:`持ち物に入りました`})]})]})}function Sr({label:e,theme:t,onClick:n}){let[r,i]=(0,a.useState)(!1);return(0,R.jsx)(`button`,{onMouseEnter:()=>i(!0),onMouseLeave:()=>i(!1),onClick:n,style:{flex:1,background:r?t.uiBorder:`#1a1008`,border:`1px solid ${r?t.uiAccent:t.uiBorder}`,color:t.uiAccent,fontFamily:Y,fontSize:12,padding:`8px 4px`,cursor:`pointer`,borderRadius:3,userSelect:`none`,textAlign:`center`,transition:`background 0.1s, border-color 0.1s`},children:e})}function Cr({context:e,config:t,onExit:n}){let r=pr(),[i,o]=(0,a.useState)(()=>on(t.map,gr(t,e),e.inventory,{initialPos:t.initialPos,initialDir:t.initialDir,initialFloor:t.initialFloor,initialVisited:t.initialVisited,initialTriggeredEvents:t.initialTriggeredEvents,initialOpenedSeals:t.initialOpenedSeals,initialOpenedTreasures:t.initialOpenedTreasures,boss:hr(t,e.flags),seals:t.seals,treasures:t.treasures})),s=lr(t.theme,t.floorThemes,i.floor),c=t.assetsBaseUrl??`/assets`;mr(c,t.bgm,t.battleBgm,t.bossBgm,!!i.battle,!!i.battle&&!!i.pendingBossTilePos);let[l,u]=(0,a.useState)(`explore`),[d,f]=(0,a.useState)(null),[p,m]=(0,a.useState)(null),[h,g]=(0,a.useState)(!1),[_,v]=(0,a.useState)(!1),[y,b]=(0,a.useState)(0),x=(0,a.useRef)(null),S=(0,a.useRef)(i.battle),C=!!i.battle&&l===`battle`,w=Cn(i),T=bn(i),E=i.lastNotice?.startsWith(`宝箱`)&&i.lastTreasureOpened?i.treasures[i.lastTreasureOpened]:void 0,D=E?E.label??t.items?.find(e=>e.id===E.itemId)?.name??E.itemId:void 0,O=(0,a.useCallback)(e=>{o(t=>An(t,e))},[]),k=(0,a.useCallback)(()=>{u(`explore`),f(null)},[]),A=(0,a.useCallback)(()=>{!i.battle||i.battle.phase!==`select`||(g(!0),window.setTimeout(()=>g(!1),180),o(e=>!e.battle||e.battle.phase!==`select`?e:An({...e,battle:{...e.battle,cursorIndex:0}},`Enter`)))},[i.battle]),j=(0,a.useCallback)(()=>{i.battle||i.atExit||o(e=>{let n=bn(e);return xn(e,n?t.items?.find(e=>e.id===n.treasure.itemId)?.name:void 0)})},[t.items,i.atExit,i.battle]),M=(0,a.useCallback)((r,a)=>{let s=t.itemEffects?.[r];if(!(s?.attackEnemy!==void 0&&!i.battle)&&!(s?.escapeToNovelScene&&i.battle)){if(s?.escapeToNovelScene&&!i.battle){let a=t._novelReturn;if(!a)return;let o=i.inventory.indexOf(r);if(o===-1)return;let c=[...i.inventory.slice(0,o),...i.inventory.slice(o+1)],l={...t,initialPos:i.pos,initialDir:i.dir,initialFloor:i.floor,initialVisited:[...i.visited],initialTriggeredEvents:[...i.triggeredEvents],initialOpenedSeals:[...i.openedSeals],initialOpenedTreasures:[...i.openedTreasures]};n({...e,flags:{...e.flags,[`explored_${t.map}`]:!0,[`maze_floor_${t.map}`]:i.floor,...ur(t.map,i.pos,i.dir),[`maze_visited_${t.map}`]:JSON.stringify([...i.visited]),[`maze_triggered_${t.map}`]:JSON.stringify([...i.triggeredEvents]),[`maze_opened_seals_${t.map}`]:JSON.stringify([...i.openedSeals]),[`maze_opened_treasures_${t.map}`]:JSON.stringify([...i.openedTreasures])},inventory:c,playerStats:{...e.playerStats,hp:i.playerMaxHp,maxHp:i.playerMaxHp,atk:i.playerAtk,def:i.playerDef}},{engineId:`novel`,transition:`rift`,config:{...a,initialSceneId:s.escapeToNovelScene,autoStart:!0},returnEngineId:`maze_rpg`,returnConfig:l,returnTransition:`rift`});return}s?.healHp!==void 0&&b(e=>e+1),o(e=>sn(e,r,a,s)),f(null),i.battle?u(`explore`):(x.current&&clearTimeout(x.current),m(s?.healHp===`full`?`${a}を使った！ HP全回復！`:typeof s?.healHp==`number`?`${a}を使った！ HP+${s.healHp}！`:`${a}を使った！`),x.current=setTimeout(()=>m(null),2500))}},[t,e,n,i]);(0,a.useEffect)(()=>{let e=e=>{if([`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`Enter`,` `].includes(e.key)&&e.preventDefault(),l===`battle`){e.key===`Escape`&&k();return}let t=e.key===`Enter`||e.key===` `;o(n=>n.battle?.phase===`select`&&n.battle.cursorIndex===2&&t?(u(`battle`),n):An(n,e.key))};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[k,l]),(0,a.useEffect)(()=>{i.battle||u(`explore`),(!i.battle||i.battle.phase!==`select`)&&f(null)},[i.battle]),(0,a.useEffect)(()=>{d&&!i.inventory.includes(d)&&f(null)},[d,i.inventory]),(0,a.useEffect)(()=>{let e=S.current,t=i.battle;if(t?.phase===`win`&&e?.phase!==`win`){v(!0);let e=window.setTimeout(()=>v(!1),900);return S.current=t,()=>window.clearTimeout(e)}(!t||t.phase===`select`)&&v(!1),S.current=t},[i.battle]),(0,a.useEffect)(()=>{if(i.battle?.phase!==`win`&&i.battle?.phase!==`lose`)return;let e=i.battle.phase===`win`?850:1050,t=window.setTimeout(()=>{o(e=>e.battle?.phase!==`win`&&e.battle?.phase!==`lose`?e:An(e,`Enter`))},e);return()=>window.clearTimeout(t)},[i.battle?.phase]);let N=(0,a.useCallback)(()=>({...e,flags:{...e.flags,[`explored_${t.map}`]:!0,[`maze_floor_${t.map}`]:i.floor,...ur(t.map,i.pos,i.dir),[`maze_visited_${t.map}`]:JSON.stringify([...i.visited]),[`maze_triggered_${t.map}`]:JSON.stringify([...i.triggeredEvents]),[`maze_opened_seals_${t.map}`]:JSON.stringify([...i.openedSeals]),[`maze_opened_treasures_${t.map}`]:JSON.stringify([...i.openedTreasures])},inventory:i.inventory,playerStats:{...e.playerStats,hp:i.playerHp,maxHp:i.playerMaxHp,atk:i.playerAtk,def:i.playerDef}}),[e,t.map,i.dir,i.floor,i.inventory,i.openedSeals,i.openedTreasures,i.playerHp,i.playerMaxHp,i.playerAtk,i.playerDef,i.pos,i.visited,i.triggeredEvents]),P=(0,a.useCallback)(()=>{let e=N(),r={...e,playerStats:{...e.playerStats,hp:i.playerMaxHp}},a=t._novelReturn;a?.exitSceneId?n(r,{engineId:`novel`,config:{...a,initialSceneId:a.exitSceneId,autoStart:!0}}):n(r)},[N,t._novelReturn,n,i.playerMaxHp]);(0,a.useEffect)(()=>{if(!i.pendingDeath)return;let r=t._novelReturn;if(r){if(i.pendingBossTilePos&&r.gameoverBossSceneId){let a={...e,flags:{...e.flags,flag_maze_defeated:!0,flag_boss_challenged:!0,[`maze_floor_${t.map}`]:i.floor,[`maze_visited_${t.map}`]:JSON.stringify([...i.visited]),[`maze_triggered_${t.map}`]:JSON.stringify([...i.triggeredEvents]),[`maze_opened_seals_${t.map}`]:JSON.stringify([...i.openedSeals]),[`maze_opened_treasures_${t.map}`]:JSON.stringify([...i.openedTreasures])},inventory:i.inventory,playerStats:{...e.playerStats,hp:i.playerMaxHp,maxHp:i.playerMaxHp,atk:i.playerAtk,def:i.playerDef}},[,o=i.pendingBossTilePos]=i.pendingBossTilePos.split(`:`),[s,c]=o.split(`,`).map(Number),l={map:t.map,name:t.name,theme:t.theme,floorThemes:t.floorThemes,assetsBaseUrl:t.assetsBaseUrl,bgm:t.bgm,battleBgm:t.battleBgm,bossBgm:t.bossBgm,floorLabelStart:t.floorLabelStart,floorLabelPrefix:t.floorLabelPrefix,items:t.items,events:t.events,boss:t.boss,weakenedBoss:t.weakenedBoss,weakenedBossFlag:t.weakenedBossFlag,boostedStatsFlag:t.boostedStatsFlag,boostedPlayerStats:t.boostedPlayerStats,boostedStatStages:t.boostedStatStages,bossVictoryScene:t.bossVictoryScene,immediatelyStartBoss:!0,seals:t.seals,treasures:t.treasures,itemEffects:t.itemEffects,_novelReturn:t._novelReturn,initialFloor:i.floor,initialPos:{x:(s??0)-1,y:c??0},initialDir:`E`,initialTriggeredEvents:[...i.triggeredEvents],initialOpenedSeals:[...i.openedSeals],initialOpenedTreasures:[...i.openedTreasures]};n(a,{engineId:`novel`,transition:`rift`,config:{...r,initialSceneId:r.gameoverLandingSceneId??r.gameoverBossSceneId,autoStart:!0},returnEngineId:`maze_rpg`,returnConfig:l,returnTransition:`rift`})}else if(r.gameoverSceneId){let a={...e,flags:{...e.flags,flag_maze_defeated:!0,[`maze_floor_${t.map}`]:i.floor,[`maze_visited_${t.map}`]:JSON.stringify([...i.visited]),[`maze_triggered_${t.map}`]:JSON.stringify([...i.triggeredEvents]),[`maze_opened_seals_${t.map}`]:JSON.stringify([...i.openedSeals]),[`maze_opened_treasures_${t.map}`]:JSON.stringify([...i.openedTreasures])},inventory:i.inventory,playerStats:{...e.playerStats,hp:i.playerMaxHp,maxHp:i.playerMaxHp,atk:i.playerAtk,def:i.playerDef}},o={map:t.map,name:t.name,theme:t.theme,floorThemes:t.floorThemes,assetsBaseUrl:t.assetsBaseUrl,bgm:t.bgm,battleBgm:t.battleBgm,bossBgm:t.bossBgm,floorLabelStart:t.floorLabelStart,floorLabelPrefix:t.floorLabelPrefix,items:t.items,events:t.events,boss:t.boss,weakenedBoss:t.weakenedBoss,weakenedBossFlag:t.weakenedBossFlag,boostedStatsFlag:t.boostedStatsFlag,boostedPlayerStats:t.boostedPlayerStats,boostedStatStages:t.boostedStatStages,bossVictoryScene:t.bossVictoryScene,seals:t.seals,treasures:t.treasures,itemEffects:t.itemEffects,_novelReturn:t._novelReturn,initialFloor:i.floor,initialTriggeredEvents:[...i.triggeredEvents],initialOpenedSeals:[...i.openedSeals],initialOpenedTreasures:[...i.openedTreasures]};n(a,{engineId:`novel`,transition:`rift`,config:{...r,initialSceneId:r.gameoverLandingSceneId??r.gameoverSceneId,autoStart:!0},returnEngineId:`maze_rpg`,returnConfig:o,returnTransition:`rift`})}}},[i.pendingDeath]),(0,a.useEffect)(()=>{if(!t.immediatelyStartBoss)return;let e=Ft[t.map];if(!e)return;let n=e[i.floor];if(!n)return;let r=null;for(let e=0;e<n.length&&!r;e++){let t=n[e];for(let n=0;n<t.length&&!r;n++)t[n]===`B`&&(r=`${i.floor}:${n},${e}`)}!r||i.triggeredEvents.has(r)||o(e=>Gt({...e,pendingBossTilePos:r}))},[]),(0,a.useEffect)(()=>{if(!i.lastBossDefeated||!t.bossVictoryScene)return;let e=t._novelReturn;if(!e)return;let r=N();n({...r,playerStats:{...r.playerStats,hp:i.playerMaxHp}},{engineId:`novel`,transition:`rift`,config:{...e,initialSceneId:t.bossVictoryScene,autoStart:!0}})},[i.lastBossDefeated]),(0,a.useEffect)(()=>{if(!i.pendingEvent)return;let e=t.events?.[i.pendingEvent],r=t._novelReturn;if(!e||!r)return;let a=N(),o=`${i.floor}:${i.pos.x},${i.pos.y}`,s={...t,initialPos:i.pos,initialDir:i.dir,initialFloor:i.floor,initialVisited:[...i.visited],initialTriggeredEvents:[...i.triggeredEvents,o],initialOpenedSeals:[...i.openedSeals],initialOpenedTreasures:[...i.openedTreasures],immediatelyStartBoss:t.bossEventKey===i.pendingEvent?!0:void 0};n(a,{engineId:`novel`,transition:`rift`,config:{...r,initialSceneId:e,autoStart:!0},returnEngineId:`maze_rpg`,returnConfig:s,returnTransition:`rift`})},[i.pendingEvent]);let F=(0,a.useCallback)(e=>{i.atExit&&(e.key!==`Enter`&&e.key!==` `||P())},[i.atExit,P]);return(0,a.useEffect)(()=>(window.addEventListener(`keydown`,F),()=>window.removeEventListener(`keydown`,F)),[F]),(0,R.jsx)(`div`,{style:{width:`100vw`,height:`100dvh`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:s.uiBg,overflow:`hidden`},children:(0,R.jsxs)(`div`,{style:{width:800,height:600,flexShrink:0,transformOrigin:`center center`,transform:`scale(${r})`,background:s.uiBg,display:`flex`,flexDirection:`column`,fontFamily:Y,color:s.uiAccent,userSelect:`none`,overflow:`hidden`,boxShadow:`0 0 60px rgba(0,0,0,0.8)`},children:[(0,R.jsx)(`style`,{children:`
          @keyframes maze-enemy-burst {
            0% { opacity: 0; transform: scale(0.45); }
            32% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.75); }
          }
          @keyframes maze-hit-slash {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(-18deg) scaleX(0.2); }
            35% { opacity: 1; transform: translate(-50%, -50%) rotate(-18deg) scaleX(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) rotate(-18deg) scaleX(1.15); }
          }
          @keyframes maze-heal-aura {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.55); filter: blur(1px); }
            22% { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
            100% { opacity: 0; transform: translate(-50%, -62%) scale(1.28); filter: blur(4px); }
          }
          @keyframes maze-heal-sparkle {
            0% { opacity: 0; transform: translate(-50%, 18px) rotate(45deg) scale(0.25); }
            28% { opacity: 1; transform: translate(-50%, -50%) rotate(45deg) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -70px) rotate(45deg) scale(0.2); }
          }
          @keyframes maze-item-drop-card {
            0% { opacity: 0; transform: translateY(12px) scale(0.92); filter: blur(2px); }
            36% { opacity: 1; transform: translateY(-2px) scale(1.03); filter: blur(0); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes maze-item-drop-shine {
            0% { transform: translateX(-100%); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          @keyframes maze-item-get-screen {
            0% { opacity: 0; }
            18% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes maze-item-get-card {
            0% { opacity: 0; transform: translateY(28px) scale(0.72); filter: blur(3px); }
            24% { opacity: 1; transform: translateY(-4px) scale(1.04); filter: blur(0); }
            74% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
            100% { opacity: 0; transform: translateY(-34px) scale(0.88); filter: blur(3px); }
          }
          @keyframes maze-item-get-shine {
            0% { transform: translateX(-100%); opacity: 0; }
            18% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          @keyframes maze-item-get-spark {
            0% { opacity: 0; transform: translateY(22px) rotate(45deg) scale(0.2); }
            30% { opacity: 1; transform: translateY(0) rotate(45deg) scale(1); }
            100% { opacity: 0; transform: translateY(-68px) rotate(45deg) scale(0.1); }
          }
          @keyframes maze-seal-screen-flash {
            0% { opacity: 0; }
            16% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes maze-seal-ring {
            0% { opacity: 0; transform: scale(0.25); }
            28% { opacity: 0.95; transform: scale(0.75); }
            100% { opacity: 0; transform: scale(1.8); }
          }
          @keyframes maze-seal-card {
            0% { opacity: 0; transform: translateY(30px) scale(0.45) rotate(-8deg); filter: blur(2px); }
            24% { opacity: 1; transform: translateY(0) scale(1.05) rotate(1deg); filter: blur(0); }
            72% { opacity: 1; transform: translateY(-4px) scale(1) rotate(0); filter: blur(0); }
            100% { opacity: 0; transform: translateY(-42px) scale(0.82) rotate(4deg); filter: blur(3px); }
          }
          @keyframes maze-seal-spark {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(45deg) scale(0.2); }
            30% { opacity: 1; transform: translate(calc(-50% + var(--seal-x) * 0.35), calc(-50% + var(--seal-y) * 0.35)) rotate(45deg) scale(1); }
            100% { opacity: 0; transform: translate(calc(-50% + var(--seal-x)), calc(-50% + var(--seal-y))) rotate(45deg) scale(0.1); }
          }
        `}),(0,R.jsxs)(`div`,{style:{background:s.uiBorder,borderBottom:`1px solid ${s.uiBorder}`,padding:`4px 12px`,fontSize:13,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexShrink:0,letterSpacing:`0.06em`},children:[(0,R.jsxs)(`span`,{children:[`⚔ `,t.name??t.map]}),(0,R.jsxs)(`span`,{style:{fontSize:11,opacity:.7},children:[fr(t,i.floor),` / 歩数: `,i.steps]})]}),(0,R.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,R.jsx)(`div`,{style:{flex:`0 0 488px`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,R.jsxs)(`div`,{style:{position:`relative`},children:[(0,R.jsxs)(`div`,{style:{border:`2px solid ${s.uiBorder}`,boxShadow:`0 0 12px rgba(100,60,10,0.4)`,position:`relative`},children:[(0,R.jsx)(Gn,{state:i,theme:s}),y>0&&(0,R.jsx)(vr,{},y),i.lastSealOpened&&(0,R.jsx)(br,{sealId:i.lastSealOpened,label:i.seals[i.lastSealOpened]?.label},`${i.lastSealOpened}-${i.steps}`),D&&(0,R.jsx)(xr,{itemName:D},`${i.lastTreasureOpened}-${i.openedTreasures.size}`),i.battle&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)($n,{enemy:i.battle.enemy,assetsBaseUrl:c,defeated:_||i.battle.phase===`win`,onClick:i.battle.phase===`select`?A:void 0}),h&&(0,R.jsx)(`div`,{style:{position:`absolute`,left:`50%`,top:`45%`,width:240,height:18,borderRadius:10,background:`linear-gradient(90deg, transparent, rgba(255,255,255,0.98), rgba(180,90,255,0.7), transparent)`,boxShadow:`0 0 18px rgba(220,180,255,0.9)`,pointerEvents:`none`,animation:`maze-hit-slash 180ms ease-out forwards`}})]}),!i.battle&&!i.atExit&&(0,R.jsxs)(`div`,{style:{position:`absolute`,inset:0,display:`grid`,gridTemplateColumns:`1fr 2fr 1fr`,gridTemplateRows:`1fr 1fr`},children:[(0,R.jsx)(`div`,{title:`左回転`,style:{cursor:`w-resize`},onClick:()=>O(`ArrowLeft`)}),(0,R.jsx)(`div`,{title:`前進`,style:{cursor:`n-resize`},onClick:()=>O(`ArrowUp`)}),(0,R.jsx)(`div`,{title:`右回転`,style:{cursor:`e-resize`},onClick:()=>O(`ArrowRight`)}),(0,R.jsx)(`div`,{title:`左回転`,style:{cursor:`w-resize`},onClick:()=>O(`ArrowLeft`)}),(0,R.jsx)(`div`,{title:`後退`,style:{cursor:`s-resize`},onClick:()=>O(`ArrowDown`)}),(0,R.jsx)(`div`,{title:`右回転`,style:{cursor:`e-resize`},onClick:()=>O(`ArrowRight`)})]}),!i.battle&&!i.atExit&&T&&(0,R.jsx)(`button`,{type:`button`,onClick:j,style:{position:`absolute`,left:`50%`,bottom:22,transform:`translateX(-50%)`,zIndex:8,minWidth:168,padding:`9px 18px`,borderRadius:4,border:`1px solid #f2c96d`,background:`linear-gradient(180deg, #40220a, #1a0902)`,color:`#ffe09a`,boxShadow:`0 0 18px rgba(255,190,80,0.45), inset 0 0 12px rgba(255,220,140,0.2)`,fontFamily:Y,fontSize:14,cursor:`pointer`,letterSpacing:`0.05em`},children:`宝箱を開ける`})]}),!i.battle&&!i.atExit&&i.lastNotice&&(0,R.jsx)(`div`,{style:{marginTop:8,background:`#20102a`,border:`1px solid ${s.uiAccent}`,borderRadius:4,padding:`8px 16px`,color:s.uiAccent,fontSize:13,textAlign:`center`,fontFamily:Y,letterSpacing:`0.04em`},children:i.lastNotice}),!i.battle&&!i.atExit&&w&&(0,R.jsx)(`div`,{onClick:()=>O(`Enter`),style:{marginTop:8,background:`#0a1f2a`,border:`1px solid #3388cc`,borderRadius:4,padding:`8px 16px`,color:`#77ccff`,fontSize:14,textAlign:`center`,cursor:`pointer`,fontFamily:Y,letterSpacing:`0.04em`},children:`下り階段を見つけた！ [Enter] / クリックで移動`}),i.atExit&&(0,R.jsx)(`div`,{onClick:P,style:{marginTop:8,background:`#1a2a0a`,border:`1px solid #44aa22`,borderRadius:4,padding:`8px 16px`,color:`#88ff44`,fontSize:14,textAlign:`center`,cursor:`pointer`,fontFamily:Y,letterSpacing:`0.04em`},children:`階段を見つけた！ [Enter] / クリックで地上へ戻る`})]})}),(0,R.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,borderLeft:`1px solid ${s.uiBorder}`,padding:`10px 10px 8px`,gap:8,overflow:`hidden`},children:[(0,R.jsx)(_r,{hp:i.playerHp,maxHp:i.playerMaxHp,theme:s}),!C&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`div`,{style:{borderTop:`1px solid ${s.uiBorder}`,flexShrink:0}}),(0,R.jsxs)(`div`,{style:{display:`flex`,gap:10,alignItems:`flex-start`,justifyContent:`center`},children:[(0,R.jsx)(`div`,{style:{border:`1px solid ${s.uiBorder}`},children:(0,R.jsx)(Jn,{state:i,mode:t.minimapMode})}),(0,R.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:4},children:[(0,R.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`24px 24px 24px`,gridTemplateRows:`24px 24px 24px`,gap:2,textAlign:`center`},children:[[``,`N`,``].map((e,t)=>(0,R.jsx)(wr,{label:e,dir:i.dir,theme:s},`t${t}`)),[`W`,``,`E`].map((e,t)=>(0,R.jsx)(wr,{label:e,dir:i.dir,theme:s},`m${t}`)),[``,`S`,``].map((e,t)=>(0,R.jsx)(wr,{label:e,dir:i.dir,theme:s},`b${t}`))]}),(0,R.jsx)(`div`,{style:{fontSize:11,color:s.uiAccent,letterSpacing:`0.05em`},children:dr[i.dir]}),(0,R.jsxs)(`div`,{style:{fontSize:9,color:s.uiBorder,letterSpacing:`0.04em`},children:[fr(t,i.floor),` (`,i.pos.x,`,`,i.pos.y,`)`]})]})]}),(0,R.jsx)(`div`,{style:{borderTop:`1px solid ${s.uiBorder}`,flexShrink:0}}),i.battle?(0,R.jsx)(Qn,{state:i,theme:s,font:Y,onSelectCommand:e=>o(t=>!t.battle||t.battle.phase!==`select`?t:{...t,battle:{...t.battle,cursorIndex:e}}),onCommand:e=>{if(e===2){u(`battle`);return}u(`explore`),o(t=>!t.battle||t.battle.phase!==`select`?t:An({...t,battle:{...t.battle,cursorIndex:e}},`Enter`))}}):(0,R.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4},children:[(0,R.jsx)(`div`,{style:{display:`flex`},children:(0,R.jsx)(Sr,{label:`↑ 前進`,theme:s,onClick:()=>O(`ArrowUp`)})}),(0,R.jsxs)(`div`,{style:{display:`flex`,gap:4},children:[(0,R.jsx)(Sr,{label:`← 左`,theme:s,onClick:()=>O(`ArrowLeft`)}),(0,R.jsx)(Sr,{label:`↓ 後退`,theme:s,onClick:()=>O(`ArrowDown`)}),(0,R.jsx)(Sr,{label:`→ 右`,theme:s,onClick:()=>O(`ArrowRight`)})]})]})]}),(!i.battle||C)&&(0,R.jsx)(ar,{inventory:i.inventory,itemDefs:t.items??[],theme:s,mode:i.battle?`battle`:`explore`,expanded:C,itemEffects:t.itemEffects,selectedItemId:d,onSelect:f,onUse:M,onClose:C?k:void 0,notification:p??void 0,font:Y})]})]})]})})}function wr({label:e,dir:t,theme:n}){let r=e===t;return(0,R.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,background:r?n.uiBorder:e?n.uiBg:`transparent`,border:e?`1px solid ${r?n.uiAccent:n.uiBorder}`:`none`,borderRadius:2,color:r?n.uiAccent:n.uiBorder,fontWeight:r?`bold`:`normal`,fontSize:10,fontFamily:Y},children:e})}var Tr={component:Cr},X=800,Er=600,Dr=50,Or=Er-Dr*2,Z=Dr+Or-50,Q=150,kr=42,Ar=72,jr=.0017,Mr=-.82,Nr=3e4,Pr=420,Fr=100,Ir=.0048,Lr=18,Rr=`'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif`,zr=[{id:`candy_01`,type:`candy`,spawnMs:1600,laneY:356,speed:.34,size:28},{id:`pot_01`,type:`pot`,spawnMs:3300,laneY:395,speed:.38,size:46},{id:`candy_02`,type:`candy`,spawnMs:4700,laneY:318,speed:.37,size:28},{id:`candy_03`,type:`candy`,spawnMs:6600,laneY:392,speed:.42,size:30},{id:`pot_02`,type:`pot`,spawnMs:8200,laneY:342,speed:.43,size:48},{id:`candy_04`,type:`candy`,spawnMs:1e4,laneY:360,speed:.46,size:28},{id:`candy_05`,type:`candy`,spawnMs:11800,laneY:302,speed:.42,size:30},{id:`pot_03`,type:`pot`,spawnMs:13700,laneY:400,speed:.48,size:50},{id:`candy_06`,type:`candy`,spawnMs:15400,laneY:340,speed:.48,size:30},{id:`candy_07`,type:`candy`,spawnMs:17600,laneY:388,speed:.52,size:28},{id:`pot_04`,type:`pot`,spawnMs:19600,laneY:330,speed:.52,size:50},{id:`candy_08`,type:`candy`,spawnMs:21500,laneY:358,speed:.55,size:30},{id:`candy_09`,type:`candy`,spawnMs:23800,laneY:305,speed:.5,size:28},{id:`pot_05`,type:`pot`,spawnMs:26e3,laneY:390,speed:.56,size:52},{id:`candy_10`,type:`candy`,spawnMs:27800,laneY:346,speed:.58,size:30}],Br=[{id:`dog_01`,type:`dog`,spawnMs:1800,laneY:392,speed:.42,size:48},{id:`bird_01`,type:`bird`,spawnMs:3800,laneY:300,speed:.46,size:42},{id:`dog_02`,type:`dog`,spawnMs:6200,laneY:394,speed:.5,size:50},{id:`bird_02`,type:`bird`,spawnMs:8400,laneY:292,speed:.52,size:44},{id:`dog_03`,type:`dog`,spawnMs:11100,laneY:396,speed:.56,size:52},{id:`bird_03`,type:`bird`,spawnMs:13600,laneY:306,speed:.58,size:42},{id:`dog_04`,type:`dog`,spawnMs:16400,laneY:390,speed:.62,size:52},{id:`bird_04`,type:`bird`,spawnMs:19e3,laneY:298,speed:.64,size:44}],Vr=[{id:`dog_01`,type:`dog`,spawnMs:1500,laneY:392,speed:.34,size:48},{id:`dog_02`,type:`dog`,spawnMs:2500,laneY:392,speed:.36,size:48},{id:`bird_01`,type:`bird`,spawnMs:3400,laneY:350,speed:.38,size:42},{id:`bird_02`,type:`bird`,spawnMs:4550,laneY:346,speed:.39,size:42},{id:`dog_03`,type:`dog`,spawnMs:5600,laneY:392,speed:.4,size:50},{id:`dog_04`,type:`dog`,spawnMs:6800,laneY:392,speed:.41,size:50},{id:`bird_03`,type:`bird`,spawnMs:7800,laneY:342,speed:.42,size:44},{id:`bird_04`,type:`bird`,spawnMs:9100,laneY:352,speed:.44,size:42},{id:`dog_05`,type:`dog`,spawnMs:10300,laneY:392,speed:.46,size:52},{id:`dog_06`,type:`dog`,spawnMs:11600,laneY:392,speed:.47,size:50},{id:`bird_05`,type:`bird`,spawnMs:13e3,laneY:354,speed:.48,size:42},{id:`bird_06`,type:`bird`,spawnMs:14400,laneY:344,speed:.49,size:44},{id:`dog_07`,type:`dog`,spawnMs:15800,laneY:392,speed:.5,size:52},{id:`dog_08`,type:`dog`,spawnMs:17300,laneY:392,speed:.51,size:52},{id:`bird_07`,type:`bird`,spawnMs:18800,laneY:346,speed:.52,size:44},{id:`bird_08`,type:`bird`,spawnMs:20400,laneY:356,speed:.53,size:42},{id:`dog_09`,type:`dog`,spawnMs:22e3,laneY:392,speed:.54,size:54},{id:`dog_10`,type:`dog`,spawnMs:23500,laneY:392,speed:.55,size:52},{id:`bird_09`,type:`bird`,spawnMs:25e3,laneY:350,speed:.56,size:44},{id:`bird_10`,type:`bird`,spawnMs:26700,laneY:344,speed:.57,size:44},{id:`drop_01`,type:`bird`,spawnMs:4200,laneY:170,speed:.34,size:46,pattern:`diagonalDrop`},{id:`drop_02`,type:`bird`,spawnMs:9e3,laneY:155,speed:.38,size:48,pattern:`diagonalDrop`},{id:`drop_03`,type:`bird`,spawnMs:14800,laneY:165,speed:.43,size:48,pattern:`diagonalDrop`},{id:`drop_04`,type:`bird`,spawnMs:20700,laneY:150,speed:.48,size:50,pattern:`diagonalDrop`},{id:`drop_05`,type:`bird`,spawnMs:26200,laneY:160,speed:.52,size:50,pattern:`diagonalDrop`}],Hr=[{id:`boss_g01`,type:`bird`,spawnMs:1200,laneY:340,speed:.4,size:46,pattern:`wobble`},{id:`boss_d01`,type:`dog`,spawnMs:2600,laneY:392,speed:.44,size:50},{id:`hdm_01`,type:`hitodama`,spawnMs:3400,laneY:445,speed:.38,size:38,pattern:`bossShot`},{id:`boss_dp01`,type:`bird`,spawnMs:4e3,laneY:100,speed:.42,size:46,pattern:`diagonalDrop`},{id:`boss_d02`,type:`dog`,spawnMs:5800,laneY:392,speed:.48,size:52},{id:`hdm_02`,type:`hitodama`,spawnMs:6600,laneY:445,speed:.4,size:38,pattern:`bossShot`},{id:`boss_g02`,type:`bird`,spawnMs:7200,laneY:320,speed:.46,size:48,pattern:`wobble`},{id:`boss_dp02`,type:`bird`,spawnMs:8800,laneY:90,speed:.46,size:48,pattern:`diagonalDrop`},{id:`hdm_03`,type:`hitodama`,spawnMs:9700,laneY:445,speed:.42,size:38,pattern:`bossShot`},{id:`boss_g03`,type:`bird`,spawnMs:10600,laneY:350,speed:.5,size:46,pattern:`wobble`},{id:`boss_d03`,type:`dog`,spawnMs:12e3,laneY:392,speed:.52,size:52},{id:`boss_dp03`,type:`bird`,spawnMs:13600,laneY:80,speed:.5,size:50,pattern:`diagonalDrop`},{id:`hdm_04`,type:`hitodama`,spawnMs:14400,laneY:445,speed:.44,size:38,pattern:`bossShot`},{id:`boss_d04`,type:`dog`,spawnMs:15300,laneY:392,speed:.54,size:54},{id:`hdm_05`,type:`hitodama`,spawnMs:16200,laneY:445,speed:.46,size:40,pattern:`bossShot`},{id:`boss_g04`,type:`bird`,spawnMs:17e3,laneY:335,speed:.54,size:48,pattern:`wobble`},{id:`boss_dp04`,type:`bird`,spawnMs:18600,laneY:85,speed:.54,size:50,pattern:`diagonalDrop`},{id:`hdm_06`,type:`hitodama`,spawnMs:19700,laneY:445,speed:.48,size:40,pattern:`bossShot`},{id:`boss_d05`,type:`dog`,spawnMs:20200,laneY:392,speed:.58,size:54},{id:`boss_g05`,type:`bird`,spawnMs:21800,laneY:325,speed:.58,size:50,pattern:`wobble`},{id:`hdm_07`,type:`hitodama`,spawnMs:22700,laneY:445,speed:.5,size:40,pattern:`bossShot`},{id:`boss_dp05`,type:`bird`,spawnMs:23400,laneY:90,speed:.58,size:52,pattern:`diagonalDrop`},{id:`boss_d06`,type:`dog`,spawnMs:24900,laneY:392,speed:.62,size:56},{id:`hdm_08`,type:`hitodama`,spawnMs:25600,laneY:445,speed:.52,size:40,pattern:`bossShot`},{id:`boss_g06`,type:`bird`,spawnMs:26400,laneY:345,speed:.62,size:48,pattern:`wobble`}],Ur=[{id:`deep_dog_01`,type:`dog`,spawnMs:1400,laneY:392,speed:.42,size:50},{id:`wobble_01`,type:`bird`,spawnMs:2600,laneY:326,speed:.38,size:48,pattern:`wobble`},{id:`deep_dog_02`,type:`dog`,spawnMs:4200,laneY:392,speed:.46,size:52},{id:`wobble_02`,type:`bird`,spawnMs:5600,laneY:310,speed:.42,size:50,pattern:`wobble`},{id:`drop_deep_01`,type:`bird`,spawnMs:7200,laneY:145,speed:.44,size:48,pattern:`diagonalDrop`},{id:`wobble_03`,type:`bird`,spawnMs:8800,laneY:348,speed:.46,size:46,pattern:`wobble`},{id:`deep_dog_03`,type:`dog`,spawnMs:10400,laneY:392,speed:.52,size:54},{id:`wobble_04`,type:`bird`,spawnMs:12200,laneY:318,speed:.5,size:50,pattern:`wobble`},{id:`drop_deep_02`,type:`bird`,spawnMs:14400,laneY:150,speed:.5,size:50,pattern:`diagonalDrop`},{id:`wobble_05`,type:`bird`,spawnMs:16600,laneY:338,speed:.54,size:50,pattern:`wobble`},{id:`deep_dog_04`,type:`dog`,spawnMs:18800,laneY:392,speed:.58,size:54},{id:`wobble_06`,type:`bird`,spawnMs:21e3,laneY:314,speed:.58,size:52,pattern:`wobble`},{id:`drop_deep_03`,type:`bird`,spawnMs:23400,laneY:140,speed:.56,size:52,pattern:`diagonalDrop`},{id:`wobble_07`,type:`bird`,spawnMs:25800,laneY:344,speed:.62,size:52,pattern:`wobble`}],Wr={sky:`#151827`,ground:`#2a2d32`,accent:`#f2d16b`};function Gr(e){return{...Wr,...e}}function Kr(){let e=()=>Math.min(1,Math.min(window.innerWidth/X,window.innerHeight/Er)),[t,n]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let t=()=>n(e());return window.addEventListener(`resize`,t),()=>window.removeEventListener(`resize`,t)},[]),t}function qr(e,t){if(t)return/^(https?:)?\/\//.test(t)||t.startsWith(`/`)?t:`${(e??`/assets`).replace(/\/$/,``)}/${t.replace(/^\//,``)}`}function Jr(e){let[t,n]=(0,a.useState)(null),[r,i]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{if(!e){n(null),i(!1);return}let t=!1,r=new Image;return r.onload=()=>{t||(n(r),i(!1))},r.onerror=()=>{t||(n(null),i(!0))},r.src=e,()=>{t=!0}},[e]),{image:t,failed:r}}function Yr(e,t,n=.28){(0,a.useEffect)(()=>{let r,i=Math.max(0,Math.min(1,n));if(t?.startsWith(`synth:`))return r=Xr(i),()=>r?.();if(t){let n=new Audio(qr(e,t));return n.loop=!0,n.volume=i,n.play().catch(()=>{}),r=()=>{n.pause(),n.currentTime=0},()=>r?.()}},[e,t,n])}function Xr(e){let t=window.AudioContext??window.webkitAudioContext;if(!t)return()=>{};let n=new t,r=n.createGain();r.gain.value=e,r.connect(n.destination);let i=n.createDelay();i.delayTime.value=.18;let a=n.createGain();a.gain.value=.18,i.connect(a),a.connect(i),i.connect(r);let o=[392,523.25,659.25,783.99,659.25,523.25,440,587.33],s=0,c=!1,l=()=>{if(c)return;let e=n.currentTime,t=n.createOscillator(),a=n.createGain();t.type=s%4==0?`square`:`triangle`,t.frequency.setValueAtTime(o[s%o.length],e),a.gain.setValueAtTime(1e-4,e),a.gain.exponentialRampToValueAtTime(.24,e+.018),a.gain.exponentialRampToValueAtTime(1e-4,e+.16),t.connect(a),a.connect(r),a.connect(i),t.start(e),t.stop(e+.18),s+=1};n.resume().catch(()=>{}),l();let u=window.setInterval(l,135);return()=>{c=!0,window.clearInterval(u),n.close().catch(()=>{})}}function Zr(){let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let t=new e,n=t.currentTime,r=t.createGain(),i=t.createOscillator(),a=t.createOscillator(),o=t.createGain();r.gain.setValueAtTime(1e-4,n),r.gain.exponentialRampToValueAtTime(.22,n+.01),r.gain.exponentialRampToValueAtTime(1e-4,n+.16),r.connect(t.destination),i.type=`square`,i.frequency.setValueAtTime(220,n),i.frequency.exponentialRampToValueAtTime(680,n+.09),i.connect(r),a.type=`triangle`,a.frequency.setValueAtTime(980,n),a.frequency.exponentialRampToValueAtTime(420,n+.08),o.gain.setValueAtTime(1e-4,n),o.gain.exponentialRampToValueAtTime(.16,n+.006),o.gain.exponentialRampToValueAtTime(1e-4,n+.11),a.connect(o),o.connect(r),t.resume().catch(()=>{}),i.start(n),a.start(n),i.stop(n+.16),a.stop(n+.12),window.setTimeout(()=>void t.close().catch(()=>{}),220)}var Qr=580;function $r(e,t,n=1){if(e.pattern===`bossShot`){if(t<=e.spawnMs)return X+200;let r=t-e.spawnMs;return r<Qr?ri:ri-(r-Qr)*e.speed*n}return X+80-Math.max(0,t-e.spawnMs)*e.speed*n}function ei(e,t=e.spawnMs,n=1){if(e.pattern===`bossShot`){if(t<=e.spawnMs)return ii;let n=t-e.spawnMs,r=Z-e.size-4;if(n<Qr){let e=n/Qr;return ii+(r-ii)*(e*e)}return r}if(e.pattern===`wobble`){let r=Math.max(0,t-e.spawnMs)*e.speed*n;return e.laneY+Math.sin(r*.032)*26}if(e.pattern===`diagonalDrop`){let r=Math.max(0,t-e.spawnMs)*e.speed*n;return Math.min(Z-e.size-6,e.laneY+r*.56)}return e.type===`dog`?Z-e.size:e.laneY}function ti(e,t,n=`entrance`){return t?n===`boss`?Hr:n===`deep`?Ur:Vr:e===`chase`?Br:zr}var $=658,ni=86,ri=$,ii=ni+42;function ai(e,t,n,r,i=72,a=120,o=0){if(n!==void 0&&n>=1)return;let s=n===void 0?1:1-n,c=n!==void 0&&n>0;if(c){let t=n;e.save(),e.globalAlpha=Math.max(0,.8*(1-t));let r=e.createRadialGradient($,ni,0,$,ni,120*t);r.addColorStop(0,`rgba(255,200,80,0.9)`),r.addColorStop(.4,`rgba(255,80,40,0.6)`),r.addColorStop(1,`rgba(100,0,0,0)`),e.fillStyle=r,e.beginPath(),e.arc($,ni,120*t,0,Math.PI*2),e.fill();for(let n=0;n<10;n+=1){let r=n/10*Math.PI*2,i=t*100,a=$+Math.cos(r)*i,o=ni+Math.sin(r)*i;e.globalAlpha=Math.max(0,.9*(1-t)),e.fillStyle=n%2==0?`#ff5a20`:`#ffd060`,e.beginPath(),e.arc(a,o,5*(1-t*.7),0,Math.PI*2),e.fill()}e.restore()}let l=c?0:Math.sin(t*.007)*10,u=.88+Math.sin(t*.013)*.1,d=ni+l,f=(.52+Math.sin(t*.018)*.16)*s;e.save(),e.globalAlpha=s;let p=e.createRadialGradient($,d,6,$,d,60);if(p.addColorStop(0,`rgba(255,60,80,${f})`),p.addColorStop(.55,`rgba(180,15,40,${f*.45})`),p.addColorStop(1,`rgba(100,0,20,0)`),e.fillStyle=p,e.beginPath(),e.arc($,d+20,60,0,Math.PI*2),e.fill(),e.shadowColor=`rgba(255,40,70,0.85)`,e.shadowBlur=20,r){let t=$-i/2,n=d-a+30+o;e.drawImage(r,t,n,i,a)}else e.fillStyle=`rgba(18,4,10,${u})`,e.fillRect($-17,d-50,34,8),e.fillRect($-11,d-66,22,18),e.fillStyle=`rgba(45,12,22,${u})`,e.beginPath(),e.arc($,d-24,19,0,Math.PI*2),e.fill(),e.shadowColor=`rgba(255,20,20,1)`,e.shadowBlur=14,e.fillStyle=`#ff2020`,e.beginPath(),e.arc($-7,d-26,3.5,0,Math.PI*2),e.fill(),e.beginPath(),e.arc($+7,d-26,3.5,0,Math.PI*2),e.fill(),e.shadowBlur=10,e.shadowColor=`rgba(255,40,70,0.7)`,e.fillStyle=`rgba(20,5,14,${u})`,e.beginPath(),e.moveTo($-17,d-8),e.lineTo($-20,d+36),e.quadraticCurveTo($-28+Math.sin(t*.016)*7,d+66,$-12+Math.sin(t*.011)*9,d+80),e.lineTo($,d+70),e.lineTo($+12+Math.sin(t*.014)*9,d+80),e.quadraticCurveTo($+28+Math.sin(t*.016)*7,d+66,$+20,d+36),e.lineTo($+17,d-8),e.closePath(),e.fill();if(e.shadowBlur=10,e.shadowColor=`rgba(255,40,70,0.7)`,!c){e.shadowBlur=8;for(let n=0;n<5;n+=1){let r=(t*.026+Math.PI*2*n/5)%(Math.PI*2),i=28+Math.sin(t*.04+n*1.3)*8,a=$+Math.cos(r)*i,o=d+24+Math.sin(r)*i*.45;e.fillStyle=`rgba(255,${60+n*22},${100-n*12},0.72)`,e.beginPath(),e.arc(a,o,3+n*.3,0,Math.PI*2),e.fill()}}e.restore()}function oi(e,t){return e.x<t.x+t.width&&e.x+e.width>t.x&&e.y<t.y+t.height&&e.y+e.height>t.y}function si(e,t){let n=e.y-(Z-Ar);return Z-t+n}function ci(e,t,n,r,i){let a=Math.sin(i*.012)*4;e.save(),e.translate(t+r/2,n+r/2),e.rotate(Math.sin(i*.008)*.4),e.fillStyle=`#ff7aa8`,e.beginPath(),e.ellipse(0,0,r*.42,r*.3,0,0,Math.PI*2),e.fill(),e.fillStyle=`#fff1b8`,e.fillRect(-r*.14,-r*.28+a*.03,r*.28,r*.56),e.fillStyle=`#ffd6e5`,e.beginPath(),e.moveTo(-r*.38,0),e.lineTo(-r*.62,-r*.2),e.lineTo(-r*.62,r*.2),e.closePath(),e.fill(),e.beginPath(),e.moveTo(r*.38,0),e.lineTo(r*.62,-r*.2),e.lineTo(r*.62,r*.2),e.closePath(),e.fill(),e.restore()}function li(e,t,n,r,i){e.save(),e.translate(t+r/2,n+r/2),e.rotate(i*.012),e.fillStyle=`#59606b`,e.beginPath(),e.roundRect(-r*.42,-r*.25,r*.84,r*.58,r*.12),e.fill(),e.strokeStyle=`#d5dde8`,e.lineWidth=4,e.beginPath(),e.arc(0,-r*.32,r*.28,Math.PI,Math.PI*2),e.stroke(),e.strokeStyle=`#2c3139`,e.lineWidth=5,e.beginPath(),e.moveTo(-r*.5,-r*.08),e.lineTo(-r*.7,-r*.08),e.moveTo(r*.5,-r*.08),e.lineTo(r*.7,-r*.08),e.stroke(),e.restore()}function ui(e,t,n,r,i){let a=Math.sin(i*.02)*3;e.save(),e.translate(t+r,n),e.scale(-1,1),e.fillStyle=`#8b5a3c`,e.fillRect(r*.16,r*.34,r*.58,r*.3),e.fillStyle=`#a46a45`,e.beginPath(),e.arc(r*.74,r*.36,r*.18,0,Math.PI*2),e.fill(),e.fillStyle=`#5b3928`,e.beginPath(),e.moveTo(r*.68,r*.22),e.lineTo(r*.78,r*.02),e.lineTo(r*.84,r*.26),e.closePath(),e.fill(),e.strokeStyle=`#5b3928`,e.lineWidth=4,e.beginPath(),e.moveTo(r*.15,r*.38),e.quadraticCurveTo(-r*.05,r*.18,r*.1,r*.08),e.stroke(),e.fillStyle=`#3b2319`,e.fillRect(r*.24,r*.62,r*.1,r*.24+a),e.fillRect(r*.56,r*.62,r*.1,r*.24-a),e.fillStyle=`#11131a`,e.beginPath(),e.arc(r*.8,r*.34,2.5,0,Math.PI*2),e.fill(),e.restore()}function di(e,t,n,r,i){let a=Math.sin(i*.012)*r*.06,o=.82+Math.sin(i*.018)*.12;e.save(),e.translate(t+r/2,n+r/2+a),e.globalAlpha=.92,e.shadowColor=`rgba(255,105,145,0.62)`,e.shadowBlur=16;let s=e.createRadialGradient(0,-r*.14,r*.08,0,0,r*.58);s.addColorStop(0,`rgba(255,238,248,${o})`),s.addColorStop(.62,`rgba(255,126,164,0.72)`),s.addColorStop(1,`rgba(112,42,92,0.52)`),e.fillStyle=s,e.beginPath(),e.moveTo(-r*.36,r*.34),e.quadraticCurveTo(-r*.46,r*.02,-r*.32,-r*.22),e.quadraticCurveTo(-r*.16,-r*.5,r*.08,-r*.46),e.quadraticCurveTo(r*.42,-r*.4,r*.38,-r*.02),e.lineTo(r*.36,r*.34),e.quadraticCurveTo(r*.25,r*.24,r*.14,r*.34),e.quadraticCurveTo(r*.02,r*.44,-r*.1,r*.34),e.quadraticCurveTo(-r*.23,r*.24,-r*.36,r*.34),e.closePath(),e.fill(),e.shadowBlur=0,e.fillStyle=`#301223`,e.beginPath(),e.ellipse(-r*.13,-r*.14,r*.055,r*.085,0,0,Math.PI*2),e.ellipse(r*.12,-r*.14,r*.055,r*.085,0,0,Math.PI*2),e.fill(),e.strokeStyle=`#301223`,e.lineWidth=Math.max(2,r*.05),e.beginPath(),e.arc(0,r*.03,r*.09,.1,Math.PI-.1),e.stroke(),e.strokeStyle=`rgba(255,226,241,0.56)`,e.lineWidth=2,e.beginPath(),e.moveTo(-r*.21,-r*.31),e.quadraticCurveTo(-r*.05,-r*.43,r*.14,-r*.34),e.stroke(),e.restore()}function fi(e,t,n,r,i){let a=Math.sin(i*.024)*r*.16;e.save(),e.translate(t+r/2,n+r/2),e.fillStyle=`#3f78a8`,e.beginPath(),e.ellipse(0,0,r*.28,r*.2,0,0,Math.PI*2),e.fill(),e.fillStyle=`#72b7d2`,e.beginPath(),e.moveTo(-r*.08,-r*.06),e.quadraticCurveTo(-r*.44,-r*.36-a,-r*.5,r*.02),e.quadraticCurveTo(-r*.26,r*.06,-r*.08,r*.04),e.fill(),e.beginPath(),e.moveTo(r*.08,-r*.06),e.quadraticCurveTo(r*.44,-r*.36+a,r*.5,r*.02),e.quadraticCurveTo(r*.26,r*.06,r*.08,r*.04),e.fill(),e.fillStyle=`#f2d16b`,e.beginPath(),e.moveTo(r*.28,-r*.02),e.lineTo(r*.44,r*.04),e.lineTo(r*.28,r*.1),e.closePath(),e.fill(),e.fillStyle=`#11131a`,e.beginPath(),e.arc(r*.16,-r*.06,2.4,0,Math.PI*2),e.fill(),e.restore()}function pi(e,t,n){let r=Math.min(650,Q+95+t*3.6),i=Z-74+Math.sin(n*.02)*3;e.save(),e.translate(r,i),e.fillStyle=`#f1d2b0`,e.fillRect(13,0,24,22),e.fillStyle=`#2b2f39`,e.fillRect(8,20,34,36),e.fillStyle=`#e6533f`,e.fillRect(4,28,42,10),e.fillStyle=`#151827`,e.fillRect(12,54,10,24),e.fillRect(30,54,10,24),e.fillStyle=`#f2d16b`,e.fillRect(17,8,4,4),e.fillRect(29,8,4,4),e.restore()}function mi(e,t,n,r,i){let a=.78+Math.sin(i*.022)*.2,o=.88+Math.sin(i*.046+t*.01)*.1;e.save(),e.translate(t+r/2,n+r/2),e.globalAlpha=.28*o,e.fillStyle=`rgba(210,100,255,0.45)`,e.beginPath(),e.ellipse(r*.52,0,r*.34,r*.16,0,0,Math.PI*2),e.fill(),e.globalAlpha=.88*o,e.shadowColor=`rgba(190,60,255,0.95)`,e.shadowBlur=20;let s=e.createRadialGradient(-r*.08,-r*.12,0,0,0,r*.48);s.addColorStop(0,`rgba(255,245,255,${a})`),s.addColorStop(.38,`rgba(205,90,255,${a*.9})`),s.addColorStop(1,`rgba(120,15,200,${a*.45})`),e.fillStyle=s,e.beginPath(),e.arc(0,0,r*.46,0,Math.PI*2),e.fill(),e.shadowBlur=10,e.globalAlpha=.96,e.fillStyle=`rgba(255,252,255,0.96)`,e.beginPath(),e.arc(-r*.1,-r*.12,r*.15,0,Math.PI*2),e.fill(),e.globalAlpha=.58*o,e.shadowBlur=8,e.fillStyle=`rgba(170,50,240,0.72)`,e.beginPath(),e.moveTo(r*.38,r*.06),e.quadraticCurveTo(r*.66,r*.28,r*.54,r*.52),e.quadraticCurveTo(r*.42,r*.3,r*.22,r*.16),e.closePath(),e.fill(),e.restore()}function hi(e,t,n,r,i=1){let a=ei(t,r,i);if(t.type===`hitodama`){mi(e,n,a,t.size,r);return}t.pattern===`wobble`?di(e,n,a,t.size,r):t.type===`candy`?ci(e,n,a,t.size,r):t.type===`pot`?li(e,n,a,t.size,r):t.type===`dog`?ui(e,n,a,t.size,r):fi(e,n,a,t.size,r)}function gi(e,t,n){let r=e.createLinearGradient(0,Dr,0,Z);r.addColorStop(0,`#26303a`),r.addColorStop(.45,`#303845`),r.addColorStop(1,`#171b22`),e.fillStyle=r,e.fillRect(0,Dr,X,Or),e.fillStyle=`rgba(255,245,205,0.12)`;for(let n=0;n<6;n+=1){let r=(n*170-t*.18%170+X)%X;e.beginPath(),e.ellipse(r+72,92,42,8,0,0,Math.PI*2),e.fill()}for(let r=0;r<8;r+=1){let i=(r*150-t*.42%150+X)%X,a=142+r%2*34;e.fillStyle=`#151922`,e.fillRect(i,a,88,74),e.strokeStyle=r%3==0?n.accent:`#c7b487`,e.lineWidth=6,e.strokeRect(i+3,a+3,82,68),e.fillStyle=r%2==0?`#58677a`:`#6b5c7a`,e.fillRect(i+19,a+22,50,28),e.fillStyle=`rgba(255,255,255,0.32)`,e.fillRect(i+24,a+57,40,5)}for(let n=0;n<6;n+=1){let r=(n*210-t*.72%210+X)%X;e.fillStyle=`rgba(9,10,16,0.42)`,e.fillRect(r+8,Z-74,92,10),e.fillStyle=`#28313a`,e.fillRect(r,Z-106,108,44),e.fillStyle=`rgba(180,230,255,0.22)`,e.fillRect(r+8,Z-98,92,25),e.strokeStyle=`rgba(230,245,255,0.38)`,e.lineWidth=2,e.strokeRect(r+8,Z-98,92,25)}e.fillStyle=n.ground,e.fillRect(0,Z,X,Er-Z),e.fillStyle=`#1d2227`;for(let n=0;n<20;n+=1){let r=(n*52-t%52+X)%X;e.fillRect(r,Z+18,32,4),e.fillRect(r+14,Z+52,38,4)}e.fillStyle=`rgba(242,209,107,0.32)`,e.fillRect(0,Z-4,X,4)}function _i(e,t,n){let r=n-t.defeatedAtMs,i=Math.min(1,r/650),a=t.x+i*84,o=t.y-Math.sin(i*Math.PI)*116+i*28;e.save(),e.globalAlpha=1-i*.25,e.translate(a+t.size/2,o+t.size/2),e.rotate(i*Math.PI*2.3),e.scale(1+i*.24,Math.max(.2,1-i*.78)),t.pattern===`wobble`?di(e,-t.size/2,-t.size/2,t.size,n):t.type===`dog`?ui(e,-t.size/2,-t.size/2,t.size,n):t.type===`bird`?fi(e,-t.size/2,-t.size/2,t.size,n):t.type===`pot`?li(e,-t.size/2,-t.size/2,t.size,n):ci(e,-t.size/2,-t.size/2,t.size,n),e.restore(),e.fillStyle=`rgba(242,209,107,${1-i})`;for(let n=0;n<5;n+=1){let r=i*Math.PI*2+n*1.25;e.fillRect(t.x+t.size/2+Math.cos(r)*(18+i*42),t.y+t.size/2+Math.sin(r)*(12+i*32),6,6)}}function vi(e,t,n,r,i){let a=Math.min(1,t.elapsedMs/n.durationMs),o=n.mode===`chase`,s=ti(n.mode,n.stompEnemies,n.enemySet),c=t.worldElapsedMs*.18,l=t.elapsedMs<t.penaltyUntilMs,u=t.gameOverAtMs===null?null:Math.min(1,(t.elapsedMs-t.gameOverAtMs)/850),d=t.clearRunAtMs===null?null:Math.min(1,(t.elapsedMs-t.clearRunAtMs)/950);if(e.fillStyle=`#000`,e.fillRect(0,0,X,Er),n.stompEnemies){if(gi(e,c,r),n.enemySet===`boss`){let n=t.clearRunAtMs===null?void 0:Math.min(1,(t.elapsedMs-t.clearRunAtMs)/950);ai(e,t.elapsedMs,n,i.bossImage,i.bossWidth,i.bossHeight,i.bossYOffset)}}else if(i.backgroundImage){let t=i.backgroundImage.width*(Or/i.backgroundImage.height),n=Math.max(1,i.backgroundLoopWidth,t),r=n*(i.backgroundImage.height/i.backgroundImage.width),a=Dr+(r>Or?(Or-r)/2:0),o=-(c*.65%n);for(let t=o-n;t<X+n;t+=n)e.drawImage(i.backgroundImage,t,a,n,r)}else{let t=e.createLinearGradient(0,0,0,Z);t.addColorStop(0,r.sky),t.addColorStop(1,`#090a12`),e.fillStyle=t,e.fillRect(0,Dr,X,Or),e.fillStyle=`rgba(255,255,255,0.12)`;for(let t=0;t<6;t+=1){let n=(t*180-c*.18%180+X)%X;e.fillRect(n,120+t%2*34,82,10)}e.fillStyle=`#202431`;for(let t=0;t<9;t+=1){let n=(t*130-c*.48%130+X)%X,r=78+t%3*34;e.fillRect(n,Z-r,72,r),e.fillStyle=`rgba(242,209,107,0.22)`,e.fillRect(n+16,Z-r+18,10,16),e.fillRect(n+44,Z-r+46,10,16),e.fillStyle=`#202431`}}if(!i.backgroundImage){e.fillStyle=r.ground,e.fillRect(0,Z,X,Er-Z),e.fillStyle=`#11131a`;for(let t=0;t<18;t+=1){let n=(t*58-c%58+X)%X;e.fillRect(n,Z+18,34,4)}for(let t=0;t<7;t+=1){let n=(t*190-c*.95%190+X)%X,i=28+t%2*18;e.fillStyle=`#342739`,e.fillRect(n,Z-i,38,i),e.fillStyle=r.accent,e.fillRect(n+8,Z-i-8,22,8)}}let f=t.grounded?Math.sin(t.elapsedMs*.018)*3:0,p=t.y+f,m=l?-34+Math.sin(t.elapsedMs*.08)*8:0;if(!i.playerImageEnabled){let n=u===null?0:-36-u*118,i=u===null?0:-Math.sin(u*Math.PI)*132+u*82,a=d===null?0:d*(X-Q+120),o=d===null?0:Math.sin(t.elapsedMs*.045)*5;e.save(),e.translate(Q+m+n+a+kr/2,p+i+o+Ar/2),e.rotate(u===null?0:-u*Math.PI*1.4),e.translate(-(Q+m+kr/2),-(p+o+Ar/2)),e.fillStyle=`#f1f3f5`,e.fillRect(Q+m+10,p,22,22),e.fillStyle=r.accent,e.fillRect(Q+m,p+24,kr,36),e.fillStyle=`#11131a`,e.fillRect(Q+m+6,p+58,12,24),e.fillRect(Q+m+25,p+58,12,24),e.fillStyle=`#f1f3f5`,e.fillRect(Q+m+kr,p+30,20,10),e.restore()}o&&!i.opponentImageEnabled&&pi(e,t.chaseDistance,t.elapsedMs);for(let r of s){if(t.collectedIds.includes(r.id)||t.hitIds.includes(r.id))continue;let i=$r(r,t.worldElapsedMs,n.objectSpeedMultiplier);i<-100||i>X+120||hi(e,r,i,t.worldElapsedMs,n.objectSpeedMultiplier)}for(let n of t.defeated)_i(e,n,t.elapsedMs);if(e.fillStyle=`rgba(0,0,0,0.35)`,e.fillRect(24,24,752,56),e.fillStyle=`rgba(255,255,255,0.18)`,e.fillRect(44,58,712,8),e.fillStyle=r.accent,e.fillRect(44,58,712*a,8),o){let r=1-Math.min(1,Math.max(0,t.chaseDistance/n.chaseStartDistance));e.fillStyle=`rgba(255,255,255,0.18)`,e.fillRect(44,70,712,6),e.fillStyle=`#ff8f70`,e.fillRect(44,70,712*r,6)}if(e.fillStyle=`#f7f2dc`,e.font=`20px ${Rr}`,e.fillText(n.name??(o?`公園の追跡劇`:`アーケード街の死闘`),44,48),e.font=`14px ${Rr}`,e.fillText(`${Math.ceil((n.durationMs-t.elapsedMs)/1e3)}秒`,708,48),e.fillText(o?`距離 ${Math.ceil(t.chaseDistance)}`:`${n.stompEnemies?`撃破`:`アメ`} ${t.score}`,610,48),n.stompEnemies){let r=Math.max(0,n.lives-t.penaltyCount);e.font=`22px ${Rr}`;for(let t=0;t<n.lives;t+=1)e.fillStyle=t<r?`#ff6f91`:`rgba(255,255,255,0.24)`,e.fillText(`♥`,44+t*28,105)}l&&(e.fillStyle=`rgba(120,0,0,0.7)`,e.fillRect(300,92,200,32),e.fillStyle=`#fff4e8`,e.font=`16px ${Rr}`,e.fillText(n.stompEnemies?`ミス！`:o?`追いつけない！`:`鍋に当たった！`,n.stompEnemies?376:o?348:344,114));let h=[i.backgroundImageConfigured&&i.backgroundImageFailed?`background image not found`:null,i.playerImageConfigured&&i.playerImageFailed?`player image not found`:null,i.opponentImageConfigured&&i.opponentImageFailed?`opponent image not found`:null].filter(Boolean);h.length>0&&(e.fillStyle=`rgba(120,0,0,0.72)`,e.fillRect(24,92,360,30),e.fillStyle=`#fff4e8`,e.font=`13px ${Rr}`,e.fillText(h.join(` / `),38,112))}function yi({context:e,config:t,onExit:n}){let r=(0,a.useRef)(null),i=t.mode??`collect`,o=Math.max(1e3,t.durationMs||Nr),s=Math.max(1,t.chaseStartDistance??Fr),c=Math.max(.001,t.chaseCatchRate??Ir),l=Math.max(0,t.chaseHitDistancePenalty??Lr),u=(0,a.useRef)({elapsedMs:0,worldElapsedMs:0,y:Z-Ar,velocityY:0,grounded:!0,score:0,penaltyCount:0,penaltyUntilMs:0,scrollFreezeUntilMs:0,chaseDistance:s,collectedIds:[],hitIds:[],defeated:[],gameOverAtMs:null,clearRunAtMs:null}),d=(0,a.useRef)(null),f=(0,a.useRef)(!1),[p,m]=(0,a.useState)(0),h=Kr(),g=(0,a.useMemo)(()=>Gr(t.theme),[t.theme]),_=t.stageId||`default`,v=qr(t.assetsBaseUrl,t.backgroundImage),y=qr(t.assetsBaseUrl,t.playerImage),b=qr(t.assetsBaseUrl,t.opponentImage),x=qr(t.assetsBaseUrl,t.bossImage);Yr(t.assetsBaseUrl,t.bgm,t.bgmVolume);let S=Jr(v),C=Jr(y),w=Jr(b),T=Jr(x),E=Math.max(1,t.backgroundLoopWidth??X),D=Math.max(1,t.playerWidth??74),O=Math.max(1,t.playerHeight??104),k=Math.max(1,t.opponentWidth??58),A=Math.max(1,t.opponentHeight??84),j=Math.max(1,t.bossWidth??72),M=Math.max(1,t.bossHeight??120),N=Math.max(.1,t.objectSpeedMultiplier??1),P=t.stompEnemies??!1,F=t.enemySet??`entrance`,ee=Math.max(1,t.lives??3),te=t.playerYOffset??0,ne=t.opponentYOffset??0,re=t.bossYOffset??0,I=(0,a.useCallback)(()=>{let e=u.current;e.grounded&&(u.current={...e,velocityY:Mr,grounded:!1})},[]),ie=(0,a.useCallback)(t=>{if(f.current)return;f.current=!0;let r=u.current;n({...e,flags:{...e.flags,cleared_runner_action:!0,[`cleared_runner_action_${_}`]:!0,runner_action_score:r.score,[`runner_action_score_${_}`]:r.score,runner_action_penalties:r.penaltyCount,[`runner_action_penalties_${_}`]:r.penaltyCount,runner_action_result:t,[`runner_action_result_${_}`]:t,runner_action_distance:Math.ceil(r.chaseDistance),[`runner_action_distance_${_}`]:Math.ceil(r.chaseDistance)},playerStats:{...e.playerStats,runnerScore:r.score,runnerPenalties:r.penaltyCount,runnerDistance:Math.ceil(r.chaseDistance)}})},[e,n,_]);(0,a.useEffect)(()=>{let e=e=>{e.key!==` `&&e.key!==`Enter`||(e.preventDefault(),I())};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[I]),(0,a.useEffect)(()=>{let e=0,n=a=>{let f=d.current??a,p=Math.min(40,a-f);d.current=a;let h=u.current,_=h.gameOverAtMs!==null||h.clearRunAtMs!==null?h.elapsedMs+p:Math.min(o,h.elapsedMs+p);if(h.gameOverAtMs!==null){let a={...h,elapsedMs:_,defeated:h.defeated.filter(e=>_-e.defeatedAtMs<700)};u.current=a;let c=r.current?.getContext(`2d`);c&&vi(c,a,{durationMs:o,mode:i,chaseStartDistance:s,objectSpeedMultiplier:N,stompEnemies:P,lives:ee,name:t.name,enemySet:F},g,{backgroundImage:S.image,backgroundImageConfigured:!!v,backgroundImageFailed:S.failed,backgroundLoopWidth:E,playerImageEnabled:!!y&&!C.failed,playerImageConfigured:!!y,playerImageFailed:C.failed,opponentImageEnabled:!!b&&!w.failed,opponentImageConfigured:!!b,opponentImageFailed:w.failed,playerWidth:D,playerHeight:O,bossImage:T.image,bossWidth:j,bossHeight:M,bossYOffset:re}),m(_),_-h.gameOverAtMs>=850?ie(`lose`):e=requestAnimationFrame(n);return}if(h.clearRunAtMs!==null){let a={...h,elapsedMs:_,worldElapsedMs:Math.min(o+950,h.worldElapsedMs+p),defeated:h.defeated.filter(e=>_-e.defeatedAtMs<700)};u.current=a;let c=r.current?.getContext(`2d`);c&&vi(c,a,{durationMs:o,mode:i,chaseStartDistance:s,objectSpeedMultiplier:N,stompEnemies:P,lives:ee,name:t.name,enemySet:F},g,{backgroundImage:S.image,backgroundImageConfigured:!!v,backgroundImageFailed:S.failed,backgroundLoopWidth:E,playerImageEnabled:!!y&&!C.failed,playerImageConfigured:!!y,playerImageFailed:C.failed,opponentImageEnabled:!!b&&!w.failed,opponentImageConfigured:!!b,opponentImageFailed:w.failed,playerWidth:D,playerHeight:O,bossImage:T.image,bossWidth:j,bossHeight:M,bossYOffset:re}),m(_),_-h.clearRunAtMs>=950?ie(`complete`):e=requestAnimationFrame(n);return}let x=h.elapsedMs<h.scrollFreezeUntilMs?0:p,k=Math.min(o,h.worldElapsedMs+x),A=i===`chase`?Math.max(0,h.chaseDistance-x*c):h.chaseDistance,te=h.velocityY+jr*p,ne=h.y+te*p,I=!1,ae=Z-Ar;ne>=ae&&(ne=ae,te=0,I=!0);let L={...h,elapsedMs:_,worldElapsedMs:k,chaseDistance:A,y:ne,velocityY:te,grounded:I},oe=ti(i,P,F),se=_<L.penaltyUntilMs,ce=Math.max(24,Math.min(D,74)-12),le=Math.max(48,Math.min(O,104)-8),ue={x:Q+(se?-34:0)+8,y:si(L,O)+4,width:ce,height:le};for(let e of oe){if(L.collectedIds.includes(e.id)||L.hitIds.includes(e.id))continue;let t=$r(e,k,N);if(t<-100||t>X+120)continue;let n={x:t,y:ei(e,k,N),width:e.size,height:e.size};if(!oi(ue,n))continue;let r=P&&(e.type===`dog`||e.type===`bird`)&&L.velocityY>0&&ue.y+ue.height<=n.y+n.height*.48;if(e.type===`candy`||r)r&&Zr(),L={...L,score:L.score+1,collectedIds:[...L.collectedIds,e.id],defeated:r?[...L.defeated,{id:e.id,type:e.type,pattern:e.pattern,x:t,y:ei(e,k,N),size:e.size,defeatedAtMs:_}]:L.defeated,velocityY:r?Mr*.62:L.velocityY,grounded:!1};else{if(se)continue;let t=L.penaltyCount+1;if(L={...L,score:Math.max(0,L.score-2),penaltyCount:t,penaltyUntilMs:_+900,scrollFreezeUntilMs:_+Pr,chaseDistance:i===`chase`?Math.min(s,L.chaseDistance+l):L.chaseDistance,hitIds:[...L.hitIds,e.id]},P&&t>=ee){L={...L,gameOverAtMs:_,scrollFreezeUntilMs:_+900};break}}}L={...L,defeated:L.defeated.filter(e=>_-e.defeatedAtMs<700)},u.current=L;let de=r.current?.getContext(`2d`);if(de&&vi(de,L,{durationMs:o,mode:i,chaseStartDistance:s,objectSpeedMultiplier:N,stompEnemies:P,lives:ee,name:t.name,enemySet:F},g,{backgroundImage:S.image,backgroundImageConfigured:!!v,backgroundImageFailed:S.failed,backgroundLoopWidth:E,playerImageEnabled:!!y&&!C.failed,playerImageConfigured:!!y,playerImageFailed:C.failed,opponentImageEnabled:!!b&&!w.failed,opponentImageConfigured:!!b,opponentImageFailed:w.failed,playerWidth:D,playerHeight:O,bossImage:T.image,bossWidth:j,bossHeight:M,bossYOffset:re}),m(_),i===`chase`&&L.chaseDistance<=0){ie(`win`);return}if(_>=o){i===`chase`?ie(`lose`):(u.current={...L,clearRunAtMs:_},e=requestAnimationFrame(n));return}e=requestAnimationFrame(n)};return e=requestAnimationFrame(n),()=>cancelAnimationFrame(e)},[S.failed,S.image,v,E,T.failed,T.image,j,M,c,l,s,o,ie,i,w.failed,w.image,b,N,C.failed,C.image,O,y,D,_,P,F,ee,t.name,g]);let ae=Math.min(1,p/o),L=u.current,oe=L.elapsedMs<L.penaltyUntilMs,se=L.gameOverAtMs===null?null:Math.min(1,(L.elapsedMs-L.gameOverAtMs)/850),ce=L.clearRunAtMs===null?null:Math.min(1,(L.elapsedMs-L.clearRunAtMs)/950),le=L.grounded?Math.sin(L.elapsedMs*.018)*3:0,ue=oe?-34+Math.sin(L.elapsedMs*.08)*8:0,de=se===null?0:-36-se*118,fe=se===null?0:-Math.sin(se*Math.PI)*132+se*82,pe=ce===null?0:ce*(X-Q+120),me=ce===null?0:Math.sin(L.elapsedMs*.045)*5,he=Q+ue+de+pe,ge=si(L,O)+le+fe+me,_e=!!y&&!C.failed,ve=Math.min(650,Q+95+L.chaseDistance*3.6),z=Z-A+Math.sin(L.elapsedMs*.02)*3,ye=i===`chase`&&!!b&&!w.failed;return(0,R.jsx)(`div`,{style:{width:`100vw`,height:`100dvh`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`#05060a`,overflow:`hidden`},children:(0,R.jsxs)(`div`,{style:{width:X,height:Er,flexShrink:0,transform:`scale(${h})`,transformOrigin:`center center`,position:`relative`,background:g.sky,overflow:`hidden`,boxShadow:`0 0 60px rgba(0,0,0,0.8)`,fontFamily:Rr},onMouseDown:I,onTouchStart:e=>{e.preventDefault(),I()},children:[(0,R.jsx)(`canvas`,{ref:r,width:X,height:Er,style:{display:`block`}}),_e&&(0,R.jsx)(`img`,{src:y,alt:``,draggable:!1,style:{position:`absolute`,left:he,top:ge+te,width:D,height:O,transform:se===null?void 0:`rotate(${-se*1.4}turn)`,transformOrigin:`50% 55%`,pointerEvents:`none`,userSelect:`none`}}),ye&&(0,R.jsx)(`img`,{src:b,alt:``,draggable:!1,style:{position:`absolute`,left:ve,top:z+ne,width:k,height:A,pointerEvents:`none`,userSelect:`none`}}),(0,R.jsxs)(`div`,{style:{position:`absolute`,left:24,right:24,bottom:22,display:`flex`,alignItems:`center`,justifyContent:`space-between`,color:`#f7f2dc`,fontSize:14,textShadow:`0 2px 6px rgba(0,0,0,0.8)`,pointerEvents:`none`},children:[(0,R.jsx)(`span`,{children:t.name??`Runner Action`}),(0,R.jsx)(`span`,{children:`Space / Enter / Click`}),(0,R.jsxs)(`span`,{children:[Math.round(ae*100),`%`]})]})]})})}var bi={component:yi},xi=`'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif`,Si=800,Ci=600,wi=148,Ti=36,Ei=130,Di=Ci-Ti-Ei,Oi=120,ki=[{symbol:`飴`,color:`#f4a260`},{symbol:`花`,color:`#f48fb1`},{symbol:`星`,color:`#fff176`},{symbol:`月`,color:`#ce93d8`},{symbol:`家`,color:`#80cbc4`},{symbol:`鐘`,color:`#80deea`},{symbol:`鳥`,color:`#a5d6a7`},{symbol:`波`,color:`#64b5f6`}],Ai=[`どれかな……`,`えーと……`,`うーん……`],ji=[`……`,`ふむ……`,`どれかな`],Mi=[`やった！`,`そろった！`,`ふふ`],Ni=[`いただき`,`ふふふ`,`そうそう`],Pi=[`あれ……`,`ちがった`,`うーん`],Fi=[`おや`,`むむ……`,`ちがったか`];async function Ii(e){let t=new TextEncoder().encode(e),n=await crypto.subtle.digest(`SHA-1`,t);return Array.from(new Uint8Array(n)).map(e=>e.toString(16).padStart(2,`0`)).join(``)}function Li(e){let t=(0,a.useRef)(null);return{speak:(0,a.useCallback)(async(n,r)=>{let i=await Ii(`${n}_${r}`),a=`${(e??`/assets`).replace(/\/$/,``)}/voicevox/${i}.wav`,o=(await fetch(a,{method:`HEAD`}).catch(()=>null))?.ok?a:null;if(!o)try{let e=await fetch(`http://localhost:50021/audio_query?text=${encodeURIComponent(n)}&speaker=${r}`,{method:`POST`}).then(e=>e.json()),t=await fetch(`http://localhost:50021/synthesis?speaker=${r}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}).then(e=>e.arrayBuffer()).catch(()=>null);t&&(o=URL.createObjectURL(new Blob([t],{type:`audio/wav`})))}catch{}if(!o)return;t.current&&t.current.pause();let s=new Audio(o);t.current=s,s.play().catch(()=>{})},[e]),stop:(0,a.useCallback)(()=>{t.current&&=(t.current.pause(),null)},[])}}function Ri(){let e=()=>Math.min(1,Math.min(window.innerWidth/Si,window.innerHeight/Ci)),[t,n]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let t=()=>n(e());return window.addEventListener(`resize`,t),()=>window.removeEventListener(`resize`,t)},[]),t}function zi(e){let t=[...e];for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}function Bi(e){let t=[];for(let n=0;n<e;n++)t.push({id:n*2,pairId:n}),t.push({id:n*2+1,pairId:n});return{cards:zi(t),flipped:[],matched:[],matchedBy:{},currentTurn:`player`,seen:{},playerPairs:0,opponentPairs:0,turns:0,phase:`playing`,lastEvent:`turn_start`,eventId:0}}var Vi=4,Hi=110,Ui=140,Wi=14,Gi=14;function Ki(e,t){if(t)return/^(https?:)?\/\//.test(t)||t.startsWith(`/`)?t:`${(e??`/assets`).replace(/\/$/,``)}/${t.replace(/^\//,``)}`}function qi(e,t,n=.28){(0,a.useEffect)(()=>{let r=Ki(e,t);if(!r)return;let i=new Audio(r);return i.loop=!0,i.volume=Math.max(0,Math.min(1,n)),i.play().catch(()=>{}),()=>{i.pause(),i.currentTime=0}},[e,t,n])}function Ji(e){return e.length===0?null:e[Math.floor(Math.random()*e.length)]}function Yi(e,t=`normal`){let n=t===`weak`?.18:.45,r=t===`weak`?.08:.25,i=e.cards.filter(t=>!e.matched.includes(t.pairId)&&!e.flipped.includes(t.id));if(i.length===0)return null;if(e.flipped.length===1){let t=e.cards.find(t=>t.id===e.flipped[0]),r=i.find(e=>t&&e.pairId===t.pairId);return r&&Math.random()<n?r.id:Ji(i)?.id??null}let a=new Map;for(let t of i)e.seen[t.id]===t.pairId&&a.set(t.pairId,[...a.get(t.pairId)??[],t.id]);let o=[...a.values()].find(e=>e.length>=2);return o&&Math.random()<r?o[0]:Ji(i)?.id??null}function Xi({side:e,name:t,faceSrc:n,score:r,active:i}){let a=e===`left`?`#fff176`:`#80deea`,o=Di-96;return(0,R.jsxs)(`div`,{style:{position:`absolute`,top:Ti,[e]:0,width:wi,height:Di,overflow:`hidden`,background:i?`rgba(${e===`left`?`255,241,118`:`128,222,234`},0.06)`:`rgba(6,6,18,0.65)`,borderRight:e===`left`?`1px solid ${i?`${a}55`:`rgba(38,42,72,0.5)`}`:`none`,borderLeft:e===`right`?`1px solid ${i?`${a}55`:`rgba(38,42,72,0.5)`}`:`none`,transition:`background 0.4s, border-color 0.4s`,zIndex:3},children:[(0,R.jsxs)(`div`,{style:{position:`absolute`,top:0,left:0,right:0,height:o,overflow:`hidden`},children:[n?(0,R.jsx)(`img`,{src:n,alt:``,draggable:!1,style:{display:`block`,width:`100%`,height:`100%`,objectFit:`contain`,objectPosition:`bottom center`,filter:i?`none`:`brightness(0.55) saturate(0.6)`,transition:`filter 0.4s`}}):(0,R.jsx)(`div`,{style:{height:`100%`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:56,color:`#1e2040`},children:e===`left`?`🎮`:`🤖`}),(0,R.jsx)(`div`,{style:{position:`absolute`,bottom:0,left:0,right:0,height:60,background:`linear-gradient(to top, ${i?e===`left`?`rgba(18,16,2,0.96)`:`rgba(2,16,18,0.96)`:`rgba(6,6,18,0.96)`} 0%, transparent 100%)`,pointerEvents:`none`}})]}),(0,R.jsxs)(`div`,{style:{position:`absolute`,bottom:0,left:0,right:0,height:96,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,gap:4,borderTop:`1px solid ${i?`${a}44`:`rgba(36,40,68,0.5)`}`,background:i?e===`left`?`rgba(22,18,2,0.92)`:`rgba(2,18,22,0.92)`:`rgba(6,6,18,0.92)`,transition:`background 0.4s, border-color 0.4s`},children:[(0,R.jsx)(`div`,{style:{fontSize:48,lineHeight:1,color:i?a:`#4a5090`,fontVariantNumeric:`tabular-nums`,textShadow:i?`0 0 24px ${a}55`:`none`,transition:`color 0.4s, text-shadow 0.4s`},children:r}),(0,R.jsx)(`div`,{style:{fontSize:10,color:`#3c4278`,letterSpacing:`0.08em`},children:`取得ペア`}),(0,R.jsx)(`div`,{style:{fontSize:11,color:i?`#c5cae9`:`#4a5090`,letterSpacing:`0.05em`,maxWidth:wi-16,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`,textAlign:`center`,transition:`color 0.4s`},children:t})]}),i&&(0,R.jsx)(`div`,{style:{position:`absolute`,top:10,...e===`left`?{right:10}:{left:10},color:a,fontSize:14,opacity:.9},children:e===`left`?`▶`:`◀`})]})}function Zi({speakerName:e,speakerSide:t,text:n}){return(0,R.jsxs)(`div`,{style:{position:`absolute`,left:0,right:0,bottom:0,height:Ei,background:`rgba(6,6,20,0.92)`,borderTop:`1px solid rgba(46,50,88,0.7)`,zIndex:10},children:[e&&(0,R.jsx)(`div`,{style:{position:`absolute`,top:-30,...t===`right`?{right:wi+20}:{left:wi+20},background:`rgba(6,6,20,0.94)`,border:`1px solid rgba(46,50,88,0.7)`,borderBottom:`none`,padding:`5px 20px`,fontSize:13,color:`#c5cae9`,letterSpacing:`0.1em`},children:e}),(0,R.jsx)(`div`,{style:{position:`absolute`,top:18,left:wi+24,right:wi+24,bottom:14,color:`#e8eaf6`,fontSize:15,lineHeight:1.9,letterSpacing:`0.08em`,overflow:`hidden`},children:n??``})]})}function Qi({context:e,config:t,onExit:n}){let r=t.mode??`solo`,i=r===`duel`,o=t.opponentSkill??`normal`,s=t.pairs??6,c=t.maxTurns??20,l=Math.ceil(s*2/Vi),u=i?Oi:Ui,d=Vi*Hi+(Vi-1)*Wi,f=l*u+(l-1)*Gi,p=Math.round((Si-d)/2),m=i?Ti+Math.round((Di-f)/2):Math.round((Ci-f)/2)+16,h=Ri(),{speak:g,stop:_}=Li(t.assetsBaseUrl);qi(t.assetsBaseUrl,t.bgm,t.bgmVolume);let[v,y]=(0,a.useState)(()=>Bi(s)),b=(0,a.useRef)(!1),[x,S]=(0,a.useState)(()=>{if(r!==`duel`)return null;let e=Ji(t.playerDialogue?.length?t.playerDialogue:Ai);return e?{speaker:`player`,text:e}:null});(0,a.useEffect)(()=>{if(v.phase!==`win`&&v.phase!==`lose`)return;let r=v.phase===`win`,i=setTimeout(()=>{n({...e,flags:{...e.flags,[`memory_game_result_${t.stageId}`]:r?`win`:`lose`,[`memory_game_player_pairs_${t.stageId}`]:v.playerPairs,[`memory_game_opponent_pairs_${t.stageId}`]:v.opponentPairs}})},2500);return()=>clearTimeout(i)},[v.phase]),(0,a.useEffect)(()=>{if(!x||!i)return;let e=x.speaker===`player`?t.playerVoicevoxSpeakerId:t.opponentVoicevoxSpeakerId;if(e!=null)return g(x.text,e),_},[x]),(0,a.useEffect)(()=>{if(!i||v.phase!==`playing`){S(null);return}let e=v.currentTurn,n;switch(v.lastEvent){case`match`:n=e===`opponent`?t.opponentMatchDialogue?.length?t.opponentMatchDialogue:Ni:t.playerMatchDialogue?.length?t.playerMatchDialogue:Mi;break;case`mismatch`:n=e===`opponent`?t.opponentMissDialogue?.length?t.opponentMissDialogue:Fi:t.playerMissDialogue?.length?t.playerMissDialogue:Pi;break;default:n=e===`opponent`?t.opponentDialogue?.length?t.opponentDialogue:ji:t.playerDialogue?.length?t.playerDialogue:Ai}let r=Ji(n);S(r?{speaker:e,text:r}:null)},[v.eventId,i,v.phase]);let C=(0,a.useCallback)(e=>{b.current||y(t=>{if(t.phase!==`playing`)return t;let n=t.cards.find(t=>t.id===e);if(!n||t.matched.includes(n.pairId)||t.flipped.includes(e)||t.flipped.length>=2)return t;let r=[...t.flipped,e],a={...t.seen,[e]:n.pairId};if(r.length<2)return{...t,flipped:r,seen:a};let[o,c]=r,l=t.cards.find(e=>e.id===o),u=t.cards.find(e=>e.id===c),d=l.pairId===u.pairId,f=t.turns+1,p=i?t.currentTurn:`player`;if(d){let e=[...t.matched,l.pairId],n=t.playerPairs+ +(p===`player`),r=t.opponentPairs+ +(p===`opponent`),o=e.length===s,c=i?n>r:!0;return{...t,flipped:[],matched:e,matchedBy:{...t.matchedBy,[l.pairId]:p},seen:a,playerPairs:n,opponentPairs:r,turns:f,phase:o?c?`win`:`lose`:`playing`,lastEvent:`match`,eventId:t.eventId+1}}return{...t,flipped:r,seen:a,turns:f,lastEvent:`mismatch`,eventId:t.eventId+1}})},[i,s,c]),w=(0,a.useCallback)(e=>{i&&v.currentTurn!==`player`||C(e)},[i,C,v.currentTurn]);(0,a.useEffect)(()=>{if(v.flipped.length!==2)return;let[e,t]=v.flipped,n=v.cards.find(t=>t.id===e),r=v.cards.find(e=>e.id===t);if(n.pairId===r.pairId)return;b.current=!0;let a=setTimeout(()=>{y(e=>({...e,flipped:[],currentTurn:i?e.currentTurn===`player`?`opponent`:`player`:e.currentTurn,phase:!i&&c>0&&e.turns>=c?`lose`:e.phase,lastEvent:`turn_start`,eventId:e.eventId+1})),b.current=!1},900);return()=>{clearTimeout(a),b.current=!1}},[v.flipped]),(0,a.useEffect)(()=>{if(!i||v.phase!==`playing`||v.currentTurn!==`opponent`||b.current)return;let e=v.flipped.length===0?650:820,t=setTimeout(()=>{let e=Yi(v,o);e!==null&&C(e)},e);return()=>clearTimeout(t)},[i,o,C,v]);let T=c>0?c-v.turns:null,E=T!==null&&T<=5,D=Ki(t.assetsBaseUrl,t.playerFaceImage),O=Ki(t.assetsBaseUrl,t.opponentFaceImage),k=t.playerName??`こちら`,A=t.opponentName??`相手`,j=Ki(t.assetsBaseUrl,t.backgroundImage),M=x?x.speaker===`player`?k:A:null,N=x?x.speaker===`player`?`left`:`right`:null;return(0,R.jsx)(`div`,{style:{width:`100vw`,height:`100dvh`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`#0a0a14`,overflow:`hidden`},children:(0,R.jsxs)(`div`,{style:{width:Si,height:Ci,position:`relative`,userSelect:`none`,overflow:`hidden`,flexShrink:0,transformOrigin:`center center`,transform:`scale(${h})`,fontFamily:xi,...j?{backgroundImage:`url(${j})`,backgroundSize:`cover`,backgroundPosition:`center`}:{background:`linear-gradient(150deg, #0d0d1a 0%, #0a0a14 60%, #0e0a1c 100%)`}},children:[j&&(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,background:`rgba(4,4,12,0.56)`,pointerEvents:`none`}}),(0,R.jsxs)(`div`,{style:{position:`absolute`,top:0,left:0,right:0,height:Ti,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:4,borderBottom:`1px solid rgba(36,40,68,0.5)`,background:`rgba(6,6,20,0.7)`},children:[(0,R.jsx)(`span`,{style:{color:`#c5cae9`,fontSize:15,letterSpacing:`0.14em`},children:t.title??`神経衰弱`}),!i&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsxs)(`span`,{style:{position:`absolute`,left:20,color:`#8bc34a`,fontSize:13},children:[v.matched.length,` / `,s,` ペア`]}),(0,R.jsx)(`span`,{style:{position:`absolute`,right:20,color:E?`#ef9a9a`:`#4a4d62`,fontSize:13},children:c>0?`残り ${T} 手`:`${v.turns} 手`})]})]}),i&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(Xi,{side:`left`,name:k,faceSrc:D,score:v.playerPairs,active:v.currentTurn===`player`&&v.phase===`playing`}),(0,R.jsx)(Xi,{side:`right`,name:A,faceSrc:O,score:v.opponentPairs,active:v.currentTurn===`opponent`&&v.phase===`playing`})]}),v.cards.map((e,t)=>{let n=t%Vi,r=Math.floor(t/Vi),a=p+n*(Hi+Wi),o=m+r*(u+Gi),s=v.flipped.includes(e.id)||v.matched.includes(e.pairId),c=v.matched.includes(e.pairId),l=ki[e.pairId%ki.length],d=(c?v.matchedBy[e.pairId]:void 0)===`opponent`?`#80deea`:l.color;return(0,R.jsx)(`div`,{onClick:()=>w(e.id),style:{position:`absolute`,left:a,top:o,width:Hi,height:u,borderRadius:10,cursor:s||i&&v.currentTurn!==`player`||b.current?`default`:`pointer`,background:s?`#141426`:`#0c0c1c`,border:c?`2px solid ${d}88`:s?`2px solid #3a3a5a`:`2px solid #1c1c30`,display:`flex`,alignItems:`center`,justifyContent:`center`,boxShadow:c?`0 0 20px ${d}36, 0 2px 8px rgba(0,0,0,0.55)`:s?`0 4px 14px rgba(0,0,0,0.65)`:`0 2px 6px rgba(0,0,0,0.45)`,transition:`background 0.12s, border-color 0.12s, box-shadow 0.2s`,zIndex:2},children:s?(0,R.jsx)(`span`,{style:{fontSize:i?44:52,color:c?`${l.color}80`:l.color,lineHeight:1},children:l.symbol}):(0,R.jsx)(`span`,{style:{fontSize:24,color:`#1c1e38`},children:`✦`})},e.id)}),i&&v.phase===`playing`&&(0,R.jsx)(Zi,{speakerName:M,speakerSide:N,text:x?.text??null}),v.phase===`win`&&(0,R.jsxs)(`div`,{style:{position:`absolute`,inset:0,zIndex:30,background:`rgba(6,6,16,0.90)`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,gap:20},children:[(0,R.jsx)(`div`,{style:{fontSize:46,color:`#fff176`,letterSpacing:`0.25em`,textShadow:`0 0 40px rgba(255,241,118,0.45)`},children:`勝　利`}),(0,R.jsx)(`div`,{style:{fontSize:16,color:`#c5cae9`,letterSpacing:`0.08em`},children:i?`${v.playerPairs} — ${v.opponentPairs}`:`${v.turns} 手でクリア`})]}),v.phase===`lose`&&(0,R.jsxs)(`div`,{style:{position:`absolute`,inset:0,zIndex:30,background:`rgba(6,6,16,0.90)`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,gap:20},children:[(0,R.jsx)(`div`,{style:{fontSize:46,color:`#ef9a9a`,letterSpacing:`0.25em`,textShadow:`0 0 40px rgba(239,154,154,0.35)`},children:`惜　敗`}),(0,R.jsx)(`div`,{style:{fontSize:16,color:`#667`,letterSpacing:`0.06em`},children:i?`${v.playerPairs} — ${v.opponentPairs}`:`もう一度チャレンジしてください`})]})]})})}var $i={component:Qi},ea=800,ta=600,na=`'Hiragino Kaku Gothic ProN', 'Meiryo', 'Yu Gothic', sans-serif`,ra=3,ia=`
@keyframes fcMountIn  { from{opacity:0;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }
@keyframes fcPhaseIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes fcNumPop   { 0%{opacity:0;transform:scale(0.65)} 65%{opacity:1;transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
@keyframes fcGoFlash  { 0%{opacity:0;transform:scale(0.45)} 55%{opacity:1;transform:scale(1.14)} 100%{opacity:1;transform:scale(1)} }
@keyframes fcLightOn  { 0%,100%{filter:brightness(0.8)} 50%{filter:brightness(1.25)} }
@keyframes fcCorrect  { 0%{transform:scale(0.8);filter:brightness(0.3)} 55%{transform:scale(1.08);filter:brightness(1.6)} 100%{transform:scale(1);filter:brightness(1)} }
@keyframes fcWrong    { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-11px)} 35%{transform:translateX(11px)} 55%{transform:translateX(-7px)} 75%{transform:translateX(7px)} 90%{transform:translateX(-3px)} }
@keyframes fcResultIn { from{opacity:0;transform:scale(0.84)} to{opacity:1;transform:scale(1)} }
@keyframes fcScan     { from{background-position:0 0} to{background-position:0 60px} }
.fc-btn { transition:transform 0.12s ease,border-color 0.15s,box-shadow 0.15s; cursor:pointer; }
.fc-btn:hover:not([disabled]) { transform:scale(1.05) !important; border-color:rgba(0,240,255,0.65) !important; box-shadow:0 0 30px rgba(0,240,255,0.28),inset 0 0 20px rgba(0,0,0,0.4) !important; }
.fc-btn:active:not([disabled]) { transform:scale(0.95) !important; }
`,aa={easy:{count:3,min:1,max:9,flashMs:800,blankMs:150,negatives:0},normal:{count:4,min:3,max:20,flashMs:600,blankMs:120,negatives:1},hard:{count:5,min:5,max:50,flashMs:400,blankMs:100,negatives:2}};function oa(e,t){return Math.floor(Math.random()*(t-e+1))+e}function sa(e){let t=[...e];for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}function ca(e){let{count:t,min:n,max:r,negatives:i}=aa[e];for(;;){let e=[oa(n,r)];for(let a=1;a<t;a++){let t=i>0&&a<=i&&Math.random()<.45;e.push(oa(n,r)*(t?-1:1))}let a=e.reduce((e,t)=>e+t,0);if(a>0)return{nums:e,answer:a}}}function la(e){let t=new Set([e]);for(let n of sa([3,7,12,18,25])){if(t.size>=4)break;let r=e+(Math.random()<.5?n:-n);r>0&&r!==e&&t.add(r)}let n=1;for(;t.size<4;)t.add(e+n),t.add(e-n),n++;return sa([...t].slice(0,4))}function ua(e){let t=ca(e);return{phase:`countdown`,countdown:5,round:0,problem:t,flashIdx:0,choices:la(t.answer),selected:null,isCorrect:null,score:0,seq:0}}function da(){let e=()=>Math.min(1,Math.min(window.innerWidth/ea,window.innerHeight/ta)),[t,n]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let t=()=>n(e());return window.addEventListener(`resize`,t),()=>window.removeEventListener(`resize`,t)},[]),t}function fa(){(0,a.useEffect)(()=>{let e=document.createElement(`style`);return e.setAttribute(`data-fc`,`1`),e.textContent=ia,document.head.appendChild(e),()=>{document.head.removeChild(e)}},[])}function pa({context:e,config:t,onExit:n}){let r=t.difficulty??`easy`,i=t.rounds??5,o=aa[r],s=da();fa();let[c,l]=(0,a.useState)(()=>ua(r)),u=(0,a.useRef)(0),d=(0,a.useCallback)(()=>(u.current+=1,u.current),[]);(0,a.useEffect)(()=>{if(c.phase!==`countdown`)return;let e=d(),t=c.countdown===0?700:460,n=setTimeout(()=>{u.current===e&&(c.countdown>0?l(e=>({...e,countdown:e.countdown-1,seq:e.seq+1})):l(e=>({...e,phase:`flash`,flashIdx:0,seq:e.seq+1})))},t);return()=>clearTimeout(n)},[c.phase,c.countdown,c.seq]),(0,a.useEffect)(()=>{if(c.phase!==`flash`)return;let e=d(),t=setTimeout(()=>{u.current===e&&(c.flashIdx+1<c.problem.nums.length?l(e=>({...e,phase:`blank`,seq:e.seq+1})):l(e=>({...e,phase:`answer`,selected:null,isCorrect:null,seq:e.seq+1})))},o.flashMs);return()=>clearTimeout(t)},[c.phase,c.flashIdx,c.seq]),(0,a.useEffect)(()=>{if(c.phase!==`blank`)return;let e=d(),t=setTimeout(()=>{u.current===e&&l(e=>({...e,phase:`flash`,flashIdx:e.flashIdx+1,seq:e.seq+1}))},o.blankMs);return()=>clearTimeout(t)},[c.phase,c.seq]),(0,a.useEffect)(()=>{if(c.phase!==`feedback`)return;let e=d(),t=setTimeout(()=>{if(u.current!==e)return;let t=c.round+1;if(t>=i)l(e=>({...e,phase:`result`,seq:e.seq+1}));else{let e=ca(r);l(n=>({...n,phase:`countdown`,countdown:5,round:t,problem:e,flashIdx:0,choices:la(e.answer),selected:null,isCorrect:null,seq:n.seq+1}))}},1400);return()=>clearTimeout(t)},[c.phase,c.round,c.seq]),(0,a.useEffect)(()=>{if(c.phase!==`result`)return;let t=d(),r=setTimeout(()=>{u.current===t&&n({...e,flags:{...e.flags,flash_calc_score:c.score,flash_calc_rounds:i,flash_calc_passed:c.score>ra},playerStats:{...e.playerStats,flash_calc_score:c.score}})},3500);return()=>clearTimeout(r)},[c.phase]);let f=(0,a.useCallback)(e=>{if(c.phase!==`answer`)return;let t=e===c.problem.answer;l(n=>({...n,phase:`feedback`,selected:e,isCorrect:t,score:t?n.score+1:n.score,seq:n.seq+1}))},[c.phase,c.problem.answer]),p=c.problem.nums[c.flashIdx],m=c.phase===`flash`?`flash-${c.flashIdx}`:c.phase;return(0,R.jsx)(`div`,{style:{width:`100vw`,height:`100dvh`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`#02020a`,overflow:`hidden`},children:(0,R.jsxs)(`div`,{style:{width:ea,height:ta,position:`relative`,overflow:`hidden`,flexShrink:0,transformOrigin:`center center`,transform:`scale(${s})`,fontFamily:na,background:[`repeating-linear-gradient(0deg,transparent,transparent 49px,rgba(0,240,255,0.04) 49px,rgba(0,240,255,0.04) 50px)`,`repeating-linear-gradient(90deg,transparent,transparent 49px,rgba(0,240,255,0.04) 49px,rgba(0,240,255,0.04) 50px)`,`linear-gradient(155deg,#07071a 0%,#040409 55%,#07040f 100%)`].join(`,`),userSelect:`none`,animation:`fcMountIn 0.55s ease-out`},children:[(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,zIndex:40,pointerEvents:`none`,background:`repeating-linear-gradient(0deg,rgba(0,0,0,0.08),rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px)`,backgroundSize:`100% 4px`,animation:`fcScan 4s linear infinite`}}),(0,R.jsx)(ma,{top:10,left:10}),(0,R.jsx)(ma,{top:10,right:10}),(0,R.jsx)(ma,{bottom:10,left:10}),(0,R.jsx)(ma,{bottom:10,right:10}),(0,R.jsx)(ha,{round:c.round,totalRounds:i,score:c.score}),(0,R.jsx)(_a,{phase:c.phase,countdown:c.countdown,currentNum:p,isNeg:typeof p==`number`&&p<0,flashIdx:c.flashIdx,totalNums:c.problem.nums.length,isCorrect:c.isCorrect,correctAnswer:c.problem.answer,selected:c.selected},m),(c.phase===`answer`||c.phase===`feedback`)&&(0,R.jsx)(ya,{choices:c.choices,selected:c.selected,correct:c.problem.answer,onSelect:f,disabled:c.phase===`feedback`}),c.phase===`result`&&(0,R.jsx)(ba,{score:c.score,total:i})]})})}function ma({top:e,bottom:t,left:n,right:r}){return(0,R.jsx)(`div`,{style:{position:`absolute`,top:e,bottom:t,left:n,right:r,width:28,height:28,zIndex:3,pointerEvents:`none`,borderTop:e===void 0?void 0:`1px solid rgba(0,240,255,0.4)`,borderBottom:t===void 0?void 0:`1px solid rgba(0,240,255,0.4)`,borderLeft:n===void 0?void 0:`1px solid rgba(0,240,255,0.4)`,borderRight:r===void 0?void 0:`1px solid rgba(0,240,255,0.4)`}})}function ha({round:e,totalRounds:t,score:n}){return(0,R.jsxs)(`div`,{style:{position:`absolute`,top:0,left:0,right:0,height:44,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`rgba(3,3,14,0.92)`,borderBottom:`1px solid rgba(0,240,255,0.15)`,zIndex:5},children:[(0,R.jsx)(`span`,{style:{color:`#6878b0`,fontSize:12,letterSpacing:`0.55em`,textTransform:`uppercase`},children:`Flash\xA0Calc`}),(0,R.jsxs)(`span`,{style:{position:`absolute`,left:40,color:`#283050`,fontSize:12,letterSpacing:`0.12em`,fontVariantNumeric:`tabular-nums`},children:[(0,R.jsx)(`span`,{style:{color:`#304070`},children:`RND`}),` `,(0,R.jsx)(`span`,{style:{color:`#4060a0`},children:e+1}),` `,(0,R.jsxs)(`span`,{style:{color:`#202840`},children:[`/ `,t]})]}),(0,R.jsxs)(`span`,{style:{position:`absolute`,right:40,display:`flex`,alignItems:`center`,gap:8,fontVariantNumeric:`tabular-nums`},children:[(0,R.jsx)(`span`,{style:{color:`#283050`,fontSize:11,letterSpacing:`0.12em`},children:`SCORE`}),(0,R.jsx)(`span`,{style:{color:`#40c070`,fontSize:18,fontWeight:700,textShadow:`0 0 12px rgba(60,200,100,0.5)`},children:n})]})]})}var ga={position:`absolute`,left:0,right:0,top:44,bottom:150,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`};function _a({phase:e,countdown:t,currentNum:n,isNeg:r,flashIdx:i,totalNums:a,isCorrect:o,correctAnswer:s,selected:c}){if(e===`result`)return null;if(e===`countdown`){let e=t===0?0:6-t,n=t===0;return(0,R.jsxs)(`div`,{style:{...ga,animation:`fcPhaseIn 0.22s ease-out`,gap:0},children:[(0,R.jsx)(`div`,{style:{fontSize:11,letterSpacing:`0.55em`,color:`#2a3060`,textTransform:`uppercase`,marginBottom:24},children:n?`Start`:`Ready`}),(0,R.jsx)(`div`,{style:{background:`radial-gradient(ellipse at 50% 30%, #0c0a1e, #060410)`,border:`1px solid rgba(60,40,110,0.55)`,borderRadius:16,padding:`26px 40px`,display:`flex`,gap:30,boxShadow:`inset 0 0 80px rgba(0,0,0,0.85), 0 4px 40px rgba(0,0,0,0.6)`},children:Array.from({length:5},(t,n)=>{let r=n<e;return(0,R.jsx)(`div`,{style:{width:56,height:56,borderRadius:`50%`,background:r?`radial-gradient(circle at 38% 32%, #ff6050 0%, #cc0000 55%, #800000 100%)`:`radial-gradient(circle at 38% 32%, #1e0c0c 0%, #0e0404 100%)`,border:`3px solid ${r?`#ff4030`:`#1a0808`}`,boxShadow:r?`0 0 22px #ff0000, 0 0 50px rgba(255,0,0,0.55), 0 0 90px rgba(255,0,0,0.25), inset 0 2px 8px rgba(255,180,160,0.25)`:`inset 0 2px 6px rgba(0,0,0,0.9)`,animation:r?`fcLightOn 1.6s ease-in-out infinite`:`none`,transition:`background 0.12s, border-color 0.12s, box-shadow 0.15s`}},n)})}),n?(0,R.jsx)(`div`,{style:{fontSize:86,color:`#00ff60`,letterSpacing:`0.1em`,marginTop:28,textShadow:`0 0 28px #00ff60, 0 0 60px rgba(0,255,96,0.6), 0 0 120px rgba(0,255,96,0.3)`,animation:`fcGoFlash 0.38s cubic-bezier(0.17,0.89,0.32,1.27)`},children:`GO！`}):(0,R.jsx)(`div`,{style:{fontSize:12,color:`#252548`,letterSpacing:`0.14em`,marginTop:22},children:`集中してください`})]})}if(e===`flash`){let e=r?`−${Math.abs(n)}`:`${n}`,t=r?`#ff7878`:`#d8eeff`,o=r?`rgba(255,80,80,0.65)`:`rgba(80,180,255,0.7)`;return(0,R.jsxs)(`div`,{style:{...ga,gap:0},children:[(0,R.jsx)(va,{total:a,done:i,active:i}),(0,R.jsx)(`div`,{style:{fontSize:118,color:t,lineHeight:1,fontWeight:700,fontVariantNumeric:`tabular-nums`,textShadow:`0 0 40px ${o}, 0 0 90px ${o.replace(`0.7`,`0.35`)}`,animation:`fcNumPop 0.2s cubic-bezier(0.17,0.89,0.32,1.27)`,letterSpacing:`0.04em`},children:e})]})}return e===`blank`?(0,R.jsx)(`div`,{style:{...ga},children:(0,R.jsx)(va,{total:a,done:i+1,active:null})}):e===`answer`?(0,R.jsxs)(`div`,{style:{...ga,gap:14,animation:`fcPhaseIn 0.25s ease-out`},children:[(0,R.jsx)(`div`,{style:{fontSize:88,color:`#3a4888`,textShadow:`0 0 24px rgba(60,80,180,0.4)`,lineHeight:1},children:`?`}),(0,R.jsx)(`div`,{style:{fontSize:13,color:`#2c2c54`,letterSpacing:`0.18em`},children:`こたえを　えらんでね`})]}):e===`feedback`?o?(0,R.jsxs)(`div`,{style:{...ga,gap:12,animation:`fcCorrect 0.42s ease-out`},children:[(0,R.jsx)(`div`,{style:{fontSize:60,color:`#50ff8c`,textShadow:`0 0 28px rgba(80,255,140,0.7), 0 0 60px rgba(80,255,140,0.35)`,letterSpacing:`0.08em`},children:`せいかい！`}),(0,R.jsx)(`div`,{style:{fontSize:42,color:`#a0ffcc`,fontVariantNumeric:`tabular-nums`,textShadow:`0 0 16px rgba(80,255,140,0.4)`},children:s})]}):(0,R.jsxs)(`div`,{style:{...ga,gap:10,animation:`fcWrong 0.48s ease-out`},children:[(0,R.jsx)(`div`,{style:{fontSize:60,color:`#ff5555`,textShadow:`0 0 28px rgba(255,60,60,0.7)`,letterSpacing:`0.08em`},children:`ざんねん`}),(0,R.jsxs)(`div`,{style:{fontSize:18,color:`#7a3a5a`,letterSpacing:`0.1em`},children:[`こたえは\xA0`,(0,R.jsx)(`span`,{style:{color:`#c06080`,fontVariantNumeric:`tabular-nums`},children:s})]}),c!==null&&(0,R.jsxs)(`div`,{style:{fontSize:13,color:`#3a2030`},children:[`あなたは `,c,` と答えました`]})]}):null}function va({total:e,done:t,active:n}){return(0,R.jsx)(`div`,{style:{display:`flex`,gap:14,marginBottom:28},children:Array.from({length:e},(e,r)=>{let i=r<t,a=r===n;return(0,R.jsx)(`div`,{style:{width:10,height:10,borderRadius:2,background:a?`#00f0ff`:i?`rgba(0,200,255,0.45)`:`rgba(24,24,50,0.7)`,boxShadow:a?`0 0 10px #00f0ff, 0 0 22px rgba(0,240,255,0.5)`:i?`0 0 4px rgba(0,200,255,0.3)`:`none`,transition:`background 0.15s, box-shadow 0.15s`}},r)})})}function ya({choices:e,selected:t,correct:n,onSelect:r,disabled:i}){return(0,R.jsx)(`div`,{style:{position:`absolute`,left:36,right:36,bottom:36,height:104,display:`flex`,gap:18,alignItems:`stretch`},children:e.map(e=>{let a=`rgba(10,8,28,0.92)`,o=`1px solid rgba(0,180,220,0.18)`,s=`#8898cc`,c=`none`,l=`none`;return i&&t!==null&&(e===n?(a=`rgba(20,60,35,0.95)`,o=`1px solid rgba(80,255,140,0.55)`,s=`#80ffb8`,c=`0 0 28px rgba(60,220,110,0.35)`,l=`fcCorrect 0.4s ease-out`):e===t&&(a=`rgba(60,18,22,0.95)`,o=`1px solid rgba(255,80,80,0.5)`,s=`#ff7070`,c=`0 0 18px rgba(255,60,60,0.3)`)),(0,R.jsx)(`button`,{className:`fc-btn`,onClick:()=>!i&&r(e),disabled:i,style:{flex:1,height:`100%`,background:a,border:o,borderRadius:10,color:s,fontSize:38,fontFamily:na,fontVariantNumeric:`tabular-nums`,fontWeight:700,boxShadow:c,animation:l,letterSpacing:`0.04em`},children:e},e)})})}function ba({score:e,total:t}){let n=e>ra,r=e===t,i=r?`#fff080`:n?`#60ff90`:`#ff6060`,a=r?`パーフェクト！`:n?`よくできました！`:`ざんねん…`;return(0,R.jsxs)(`div`,{style:{position:`absolute`,inset:0,zIndex:30,background:`rgba(2,2,12,0.94)`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,gap:0,animation:`fcResultIn 0.5s cubic-bezier(0.17,0.89,0.32,1.27)`},children:[(0,R.jsx)(`div`,{style:{fontSize:11,letterSpacing:`0.55em`,color:`#242448`,textTransform:`uppercase`,marginBottom:32},children:`Result`}),(0,R.jsx)(`div`,{style:{fontSize:46,color:i,letterSpacing:`0.14em`,textShadow:`0 0 36px ${i}88, 0 0 70px ${i}44`,marginBottom:24},children:a}),(0,R.jsxs)(`div`,{style:{display:`flex`,alignItems:`baseline`,gap:14},children:[(0,R.jsx)(`span`,{style:{fontSize:92,color:i,fontVariantNumeric:`tabular-nums`,fontWeight:700,textShadow:`0 0 50px ${i}66, 0 0 100px ${i}33`},children:e}),(0,R.jsxs)(`span`,{style:{fontSize:28,color:`#242448`},children:[`/ `,t]})]}),!n&&(0,R.jsx)(`div`,{style:{fontSize:15,color:`#4a2840`,letterSpacing:`0.12em`,marginTop:20},children:`4もん以上せいかいしてね`})]})}var xa={component:pa},Sa=800,Ca=600,wa=`'Hiragino Kaku Gothic ProN', 'Meiryo', 'Yu Gothic', sans-serif`,Ta=[`●`,`◆`,`▲`,`★`,`✚`,`■`,`⬟`,`✦`],Ea=[`#f4c95d`,`#7dd3fc`,`#f0abfc`,`#86efac`,`#fca5a5`,`#c4b5fd`],Da=`
@keyframes sdProblemIn {
  from { opacity: 0; transform: scale(0.9) translateY(10px); filter: brightness(1.8); }
  to { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
}
@keyframes sdCorrectBurst {
  0%   { opacity: 0; transform: scale(0.3); filter: brightness(3); }
  20%  { opacity: 1; transform: scale(1.1); filter: brightness(2); }
  55%  { opacity: 0.85; transform: scale(2.2); filter: brightness(1.3); }
  100% { opacity: 0; transform: scale(3.4); filter: brightness(1); }
}
@keyframes sdCorrectRing {
  0%   { opacity: 0.95; transform: scale(0.25); border-width: 10px; }
  55%  { opacity: 0.55; transform: scale(2.0); border-width: 4px; }
  100% { opacity: 0;    transform: scale(3.2); border-width: 1px; }
}
@keyframes sdCorrectSparkle {
  0%   { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(0deg); }
  25%  { opacity: 1; transform: translate(-50%,-50%) scale(1.2) rotate(60deg); }
  100% { opacity: 0; transform: translate(var(--sx),var(--sy)) scale(0.15) rotate(220deg); }
}
@keyframes sdCorrectScreen {
  0%   { opacity: 0; }
  12%  { opacity: 0.52; }
  100% { opacity: 0; }
}
@keyframes sdPenaltyFloat {
  0%   { opacity: 0; transform: translateY(8px) scale(0.75); }
  14%  { opacity: 1; transform: translateY(-4px) scale(1.15); }
  50%  { opacity: 1; transform: translateY(-12px) scale(1); }
  100% { opacity: 0; transform: translateY(-58px) scale(0.9); }
}
@keyframes sdWrongShake {
  0%   { transform: translateX(0) rotate(0deg); }
  10%  { transform: translateX(-18px) rotate(-4deg); }
  25%  { transform: translateX(18px) rotate(4deg); }
  40%  { transform: translateX(-15px) rotate(-3deg); }
  57%  { transform: translateX(14px) rotate(2.5deg); }
  72%  { transform: translateX(-9px) rotate(-1.5deg); }
  86%  { transform: translateX(6px) rotate(0.8deg); }
  100% { transform: translateX(0) rotate(0deg); }
}
@keyframes sdWrongCellFlash {
  0%   { opacity: 0; }
  18%  { opacity: 0.88; }
  100% { opacity: 0; }
}
@keyframes sdWrongScreen {
  0%   { opacity: 0; }
  16%  { opacity: 0.46; }
  100% { opacity: 0; }
}
.sd-cell-in        { animation: sdProblemIn 360ms ease both; }
.sd-correct-burst  { animation: sdCorrectBurst 780ms ease-out both; }
.sd-correct-ring   { animation: sdCorrectRing  700ms ease-out both; }
.sd-correct-screen { animation: sdCorrectScreen 680ms ease-out both; }
.sd-sparkle        { animation: sdCorrectSparkle 640ms ease-out both; }
.sd-penalty-float  { animation: sdPenaltyFloat 920ms ease-out both; }
.sd-wrong-shake    { animation: sdWrongShake 440ms ease both; }
.sd-wrong-flash    { animation: sdWrongCellFlash 480ms ease-out both; }
.sd-wrong-screen   { animation: sdWrongScreen 520ms ease-out both; }
`;function Oa(){let e=()=>Math.min(1,Math.min(window.innerWidth/Sa,window.innerHeight/Ca)),[t,n]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let t=()=>n(e());return window.addEventListener(`resize`,t),()=>window.removeEventListener(`resize`,t)},[]),t}function ka(e,t){if(!t)return;if(/^(https?:|data:|blob:)/.test(t))return t;let n=(e??``).replace(/\/$/,``),r=t.replace(/^\//,``);return n?`${n}/${r}`:`/${r}`}function Aa(e){return Math.floor(Math.random()*e)}function ja(e,t){let n=Aa(Ta.length),r=Aa(Ta.length);r===n&&(r=(r+1)%Ta.length);let i=Ta[n],a=Ta[r],o=Aa(e),s=Ea[Aa(Ea.length)];if(t.length>=2){let e=Aa(t.length),n=Aa(t.length);return n===e&&(n=(n+1)%t.length),{base:i,odd:a,baseImage:t[e],oddImage:t[n],oddIndex:o,tint:s}}return{base:i,odd:a,oddIndex:o,tint:s}}function Ma({context:e,config:t,onExit:n}){let r=Oa(),i=t.stageId||`default`,o=t.bgm??`audio/bgm/quiz.mp3`,s=Math.max(5e3,t.timeLimitMs??3e4),c=Math.max(0,t.timePenaltyMs??3e3),l=Math.max(1,t.targetCount??5),u=Math.max(4,t.gridSize??36),d=Math.max(2,Math.min(u,t.gridColumns??6)),f=Math.max(36,Math.min(112,t.cellSize??62)),p=Math.max(4,Math.min(20,t.cellGap??12)),m=(0,a.useMemo)(()=>(t.imagePool??[]).map(e=>ka(t.assetsBaseUrl,e)).filter(e=>!!e),[t.assetsBaseUrl,t.imagePool]),[h]=(0,a.useState)(()=>Date.now()),[g,_]=(0,a.useState)(()=>Date.now()),[v,y]=(0,a.useState)(0),[b,x]=(0,a.useState)(0),[S,C]=(0,a.useState)(0),[w,T]=(0,a.useState)(0),[E,D]=(0,a.useState)(null),[O,k]=(0,a.useState)(null),[A,j]=(0,a.useState)(null),[M,N]=(0,a.useState)(()=>ja(u,m)),P=Math.max(0,s-(g-h)-w);(0,a.useEffect)(()=>{let e=ka(t.assetsBaseUrl,o);if(!e)return;let n=new Audio(e);return n.loop=!0,n.volume=.55,n.play().catch(()=>{}),()=>{n.pause(),n.currentTime=0}},[o,t.assetsBaseUrl]),(0,a.useEffect)(()=>{N(ja(u,m)),y(0)},[u,m]),(0,a.useEffect)(()=>{if(A)return;let e=window.setInterval(()=>_(Date.now()),100);return()=>window.clearInterval(e)},[A]),(0,a.useEffect)(()=>{!A&&P<=0&&j(b>=l?`win`:`lose`)},[A,P,b,l]),(0,a.useEffect)(()=>{if(!A)return;let t=window.setTimeout(()=>{n({...e,flags:{...e.flags,spot_difference_result:A,[`spot_difference_result_${i}`]:A,spot_difference_score:b,[`spot_difference_score_${i}`]:b},playerStats:{...e.playerStats,spotDifferenceScore:b}})},1600);return()=>window.clearTimeout(t)},[e,A,n,b,i]);let F=(0,a.useCallback)(e=>{if(!(A||E))if(e===M.oddIndex){let t=b+1,n=Date.now();D({type:`correct`,index:e,seq:n}),k({type:`correct`,seq:n}),window.setTimeout(()=>{x(t),D(null),t>=l?j(`win`):(N(ja(u,m)),y(e=>e+1))},780)}else{let t=Date.now();D({type:`wrong`,index:e,seq:t}),k({type:`wrong`,seq:t}),C(e=>e+1),T(e=>e+c),window.setTimeout(()=>D(null),580)}},[E,A,u,m,M.oddIndex,b,l,c]),ee=d*f+(d-1)*p,te=Math.ceil(u/d),ne=te*f+(te-1)*p,re=(Sa-ee)/2,I=Math.max(112,320-ne/2);return(0,R.jsx)(`div`,{style:{width:`100vw`,height:`100dvh`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`#05060a`,overflow:`hidden`},children:(0,R.jsxs)(`div`,{style:{width:Sa,height:Ca,transform:`scale(${r})`,transformOrigin:`center center`,position:`relative`,overflow:`hidden`,fontFamily:wa,background:`linear-gradient(180deg,#16151d,#2d2632 55%,#101018)`},children:[(0,R.jsx)(`style`,{children:Da}),(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,background:`radial-gradient(circle at 50% 25%, rgba(255,90,110,0.24), transparent 44%)`}}),O&&(0,R.jsx)(`div`,{className:O.type===`correct`?`sd-correct-screen`:`sd-wrong-screen`,style:{position:`absolute`,inset:0,background:O.type===`correct`?`radial-gradient(ellipse at 50% 50%, rgba(255,240,100,0.82), rgba(255,180,60,0.5) 45%, transparent 72%)`:`radial-gradient(ellipse at 50% 50%, rgba(255,30,30,0.78), rgba(180,0,0,0.48) 48%, transparent 72%)`,pointerEvents:`none`,zIndex:40}},O.seq),(0,R.jsxs)(`div`,{style:{position:`absolute`,top:24,left:28,right:28,height:70,border:`1px solid rgba(255,255,255,0.18)`,background:`rgba(0,0,0,0.34)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`0 24px`,color:`#f7f2dc`},children:[(0,R.jsx)(`span`,{style:{fontSize:20},children:t.title??`違う絵探し`}),(0,R.jsxs)(`span`,{children:[`残り `,Math.ceil(P/1e3),` 秒`]}),(0,R.jsxs)(`span`,{children:[`発見 `,b,` / `,l]})]}),Array.from({length:u},(e,t)=>{let n=t%d,r=Math.floor(t/d),i=t===M.oddIndex,a=i?M.oddImage:M.baseImage,o=!!a,s=E?.index===t;return(0,R.jsxs)(`button`,{className:[`sd-cell-in`,s&&E?.type===`wrong`?`sd-wrong-shake`:``].filter(Boolean).join(` `),onClick:()=>F(t),style:{position:`absolute`,left:re+n*(f+p),top:I+r*(f+p),width:f,height:f,borderRadius:8,border:o||!i?`2px solid rgba(255,255,255,0.16)`:`2px solid ${M.tint}`,backgroundColor:o?`#111`:`rgba(8,8,14,0.74)`,backgroundImage:o?`url("${a}")`:void 0,backgroundPosition:`center`,backgroundSize:`cover`,backgroundRepeat:`no-repeat`,color:i?`#fff7cc`:M.tint,fontSize:30,cursor:A||E?`default`:`pointer`,boxShadow:o||!i?`0 4px 12px rgba(0,0,0,0.35)`:`0 0 24px ${M.tint}44`,overflow:`hidden`,padding:0,animationDelay:`${Math.min(180,t*10)}ms`},children:[o?(0,R.jsx)(`span`,{style:{position:`absolute`,inset:0,background:`linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.18))`}}):i?M.odd:M.base,s&&E?.type===`correct`&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`span`,{className:`sd-correct-burst`,style:{position:`absolute`,inset:-24,borderRadius:999,background:`radial-gradient(circle, rgba(255,252,180,1) 0%, rgba(255,200,60,0.85) 30%, rgba(255,100,160,0.5) 55%, transparent 72%)`,boxShadow:`0 0 32px rgba(255,230,80,0.9), 0 0 64px rgba(255,150,50,0.5)`,pointerEvents:`none`}}),(0,R.jsx)(`span`,{className:`sd-correct-ring`,style:{position:`absolute`,inset:-16,borderRadius:999,border:`8px solid rgba(255,230,80,0.9)`,boxShadow:`0 0 18px rgba(255,200,60,0.8)`,pointerEvents:`none`}}),[0,60,120,180,240,300].map(e=>{let t=e*Math.PI/180,n=f*1.1;return(0,R.jsx)(`span`,{className:`sd-sparkle`,style:{position:`absolute`,left:`50%`,top:`50%`,width:10,height:10,borderRadius:2,background:e%120==0?`#fff9c4`:`#ffd54f`,boxShadow:`0 0 8px rgba(255,220,60,1)`,pointerEvents:`none`,"--sx":`calc(-50% + ${Math.cos(t)*n}px)`,"--sy":`calc(-50% + ${Math.sin(t)*n}px)`,animationDelay:`${e*.5}ms`}},e)})]}),s&&E?.type===`wrong`&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`span`,{className:`sd-wrong-flash`,style:{position:`absolute`,inset:0,borderRadius:6,background:`rgba(220,30,30,0.82)`,boxShadow:`inset 0 0 18px rgba(255,60,60,0.9)`,pointerEvents:`none`}}),(0,R.jsxs)(`span`,{className:`sd-penalty-float`,style:{position:`absolute`,left:-14,right:-14,top:-36,color:`#ff4060`,fontSize:22,fontWeight:900,textShadow:`0 0 12px rgba(255,60,60,0.95), 0 2px 10px rgba(0,0,0,0.9)`,pointerEvents:`none`,letterSpacing:`0.04em`},children:[`-`,Math.ceil(c/1e3),`秒！`]})]})]},`${v}-${t}`)}),(0,R.jsxs)(`div`,{style:{position:`absolute`,left:40,bottom:28,right:40,color:`#d8d0c4`,display:`flex`,justifyContent:`space-between`,fontSize:15},children:[(0,R.jsxs)(`span`,{children:[u,`枚の中から違う絵を探す`]}),(0,R.jsxs)(`span`,{children:[`ミス `,S]})]}),A&&(0,R.jsxs)(`div`,{style:{position:`absolute`,inset:0,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,background:`rgba(5,5,10,0.86)`,color:A===`win`?`#fff176`:`#ef9a9a`,fontSize:48,letterSpacing:`0.18em`},children:[A===`win`?`浄　化`:`失　敗`,(0,R.jsxs)(`span`,{style:{marginTop:18,color:`#d8d0c4`,fontSize:18,letterSpacing:0},children:[b,` / `,l]})]})]})})}var Na={component:Ma},Pa=800,Fa=600,Ia=`'Hiragino Kaku Gothic ProN', 'Meiryo', 'Yu Gothic', sans-serif`;function La(){let e=()=>Math.min(1,Math.min(window.innerWidth/Pa,window.innerHeight/Fa)),[t,n]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let t=()=>n(e());return window.addEventListener(`resize`,t),()=>window.removeEventListener(`resize`,t)},[]),t}function Ra(e,t,n){let r=(e-t)%n/n;return r<.5?r*2:2-r*2}function za(e){return[.5,.34,.68,.42,.58,.26,.74,.48][e%8]}function Ba(e,t){if(t)return/^(https?:)?\/\//.test(t)||t.startsWith(`/`)?t:`${(e??`/assets`).replace(/\/$/,``)}/${t.replace(/^\//,``)}`}function Va(e,t,n=.28){(0,a.useEffect)(()=>{let r=Ba(e,t);if(!r)return;let i=new Audio(r);return i.loop=!0,i.volume=Math.max(0,Math.min(1,n)),i.play().catch(()=>{}),()=>{i.pause(),i.currentTime=0}},[e,t,n])}function Ha({context:e,config:t,onExit:n}){let r=La();Va(t.assetsBaseUrl,t.bgm,t.bgmVolume);let i=t.stageId||`default`,o=Math.max(1,t.rounds??6),s=Math.max(1,Math.min(o,t.targetHits??4)),c=Math.max(900,t.cycleMs??1700),l=Math.max(.08,Math.min(.34,t.targetWidth??.18)),u=Math.max(0,Math.min(.08,t.timingGrace??.018)),[d,f]=(0,a.useState)(()=>Date.now()),[p,m]=(0,a.useState)(()=>Date.now()),[h,g]=(0,a.useState)(0),[_,v]=(0,a.useState)(0),[y,b]=(0,a.useState)(0),[x,S]=(0,a.useState)(null),[C,w]=(0,a.useState)(null),T=(0,a.useMemo)(()=>{let e=za(h);return{left:Math.max(0,e-l/2),right:Math.min(1,e+l/2)}},[h,l]),E=Ra(p,d,c),D=(Pa-540)/2;(0,a.useEffect)(()=>{if(C)return;let e=0,t=()=>{m(Date.now()),e=window.requestAnimationFrame(t)};return e=window.requestAnimationFrame(t),()=>window.cancelAnimationFrame(e)},[C]),(0,a.useEffect)(()=>{if(!C)return;let t=window.setTimeout(()=>{n({...e,flags:{...e.flags,timing_game_result:C,[`timing_game_result_${i}`]:C,timing_game_hits:_,[`timing_game_hits_${i}`]:_},playerStats:{...e.playerStats,timingGameHits:_}})},1500);return()=>window.clearTimeout(t)},[e,C,_,n,i]);let O=(0,a.useCallback)(()=>{if(C||x)return;let e=Date.now(),t=Ra(e,d,c),n=t>=T.left-u&&t<=T.right+u,r=h+1,i=_+ +!!n;m(e),S(n?`hit`:`miss`),window.setTimeout(()=>{if(S(null),i>=s){v(i),w(`win`);return}if(r>=o){v(i),w(i>=s?`win`:`lose`);return}g(r),v(i),b(e=>e+ +!n),f(Date.now())},520)},[c,x,C,_,h,o,d,T.left,T.right,s,u]);return(0,a.useEffect)(()=>{let e=e=>{e.key!==` `&&e.key!==`Enter`||(e.preventDefault(),O())};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[O]),(0,R.jsx)(`div`,{style:{width:`100vw`,height:`100dvh`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`#05060a`,overflow:`hidden`},children:(0,R.jsxs)(`div`,{style:{width:Pa,height:Fa,transform:`scale(${r})`,transformOrigin:`center center`,position:`relative`,overflow:`hidden`,fontFamily:Ia,background:`linear-gradient(180deg,#15151c,#30202b 58%,#0d0e13)`,color:`#f8f1df`},children:[(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,background:`radial-gradient(circle at 50% 35%, rgba(255,88,118,0.25), transparent 45%)`}}),(0,R.jsxs)(`div`,{style:{position:`absolute`,top:24,left:28,right:28,height:70,border:`1px solid rgba(255,255,255,0.18)`,background:`rgba(0,0,0,0.34)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`0 24px`},children:[(0,R.jsx)(`span`,{style:{fontSize:20},children:t.title??`タイミング勝負`}),(0,R.jsxs)(`span`,{children:[`成功 `,_,` / `,s]}),(0,R.jsxs)(`span`,{children:[Math.min(h+1,o),` / `,o]})]}),(0,R.jsxs)(`div`,{style:{position:`absolute`,left:D,top:252,width:540,height:52,borderRadius:8,background:`#171922`,border:`2px solid rgba(255,255,255,0.2)`,boxShadow:`inset 0 0 22px rgba(0,0,0,0.55)`},children:[(0,R.jsx)(`div`,{style:{position:`absolute`,left:T.left*540,top:0,width:(T.right-T.left)*540,height:`100%`,background:`rgba(255,225,103,0.72)`,boxShadow:`0 0 24px rgba(255,225,103,0.35)`}}),(0,R.jsx)(`div`,{style:{position:`absolute`,left:E*540-5,top:-14,width:10,height:80,borderRadius:999,background:`#ff5f87`,boxShadow:`0 0 18px rgba(255,95,135,0.72)`}})]}),(0,R.jsx)(`button`,{onClick:O,disabled:!!(C||x),style:{position:`absolute`,left:300,top:354,width:200,height:58,borderRadius:8,border:`1px solid rgba(255,255,255,0.28)`,background:`#f3d15f`,color:`#22170d`,fontSize:20,fontWeight:700,cursor:C||x?`default`:`pointer`},children:`止める`}),(0,R.jsxs)(`div`,{style:{position:`absolute`,left:44,bottom:34,right:44,display:`flex`,justifyContent:`space-between`,color:`#d8d0c4`,fontSize:15},children:[(0,R.jsx)(`span`,{children:`黄色い範囲で止める`}),(0,R.jsxs)(`span`,{children:[`ミス `,y]})]}),x&&(0,R.jsx)(`div`,{style:{position:`absolute`,inset:0,display:`flex`,alignItems:`center`,justifyContent:`center`,color:x===`hit`?`#fff176`:`#ef9a9a`,fontSize:56,background:`rgba(0,0,0,0.24)`,letterSpacing:`0.12em`},children:x===`hit`?`成功`:`失敗`}),C&&(0,R.jsxs)(`div`,{style:{position:`absolute`,inset:0,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,background:`rgba(5,5,10,0.86)`,color:C===`win`?`#fff176`:`#ef9a9a`,fontSize:48,letterSpacing:`0.18em`},children:[C===`win`?`浄　化`:`失　敗`,(0,R.jsxs)(`span`,{style:{marginTop:18,color:`#d8d0c4`,fontSize:18,letterSpacing:0},children:[_,` / `,s]})]})]})})}var Ua={component:Ha},Wa=Ot(),Ga=Ot(`chapter2`),Ka=Ot(`chapter3`),qa=Ot(`chapter4`),Ja=Ot(`chapter5`),Ya=Ot(`chapter6`),Xa=`/dnovel/assets`,Za=[{id:`chapter1`,title:`第1章へ`,chapterTitle:`赤羽の一日`,masterData:Wa,initialSceneId:`scene_danchi_morning`,initialLocationId:`loc_danchi`,initialFlags:{flag_chapter:1}},{id:`chapter2`,title:`第2章へ`,chapterTitle:`一番街の怨霊`,masterData:Ga,initialSceneId:`scene_ch2_start`,initialLocationId:`loc_danchi`,unlockFlag:`flag_chapter1_cleared`,initialFlags:{flag_chapter:2,flag_chapter1_cleared:!0}},{id:`chapter3`,title:`第3章へ`,chapterTitle:`アーケード街の死闘`,masterData:Ka,initialSceneId:`scene_ch3_start`,initialLocationId:`loc_danchi`,unlockFlag:`flag_ch2_cleared`,initialFlags:{flag_chapter:3,flag_chapter1_cleared:!0,flag_ch2_cleared:!0}},{id:`chapter4`,title:`第4章へ`,chapterTitle:`七つのグミ`,masterData:qa,initialSceneId:`scene_ch4_start`,initialLocationId:`loc_danchi`,unlockFlag:`flag_ch3_cleared`,initialFlags:{flag_chapter:4,flag_chapter1_cleared:!0,flag_ch2_cleared:!0,flag_ch3_cleared:!0,flag_station_explored:!0,flag_visited_slope:!0,flag_ch3_museum_unlocked:!0}},{id:`chapter5`,title:`第5章へ`,chapterTitle:`美術館の迷宮`,masterData:Ja,initialSceneId:`scene_ch5_start`,initialLocationId:`loc_danchi`,unlockFlag:`flag_ch4_cleared`,initialFlags:{flag_chapter:5,flag_chapter1_cleared:!0,flag_ch2_cleared:!0,flag_ch3_cleared:!0,flag_ch4_cleared:!0,flag_station_explored:!0,flag_visited_slope:!0,flag_ch3_museum_unlocked:!0}},{id:`chapter6`,title:`第6章へ`,chapterTitle:`伝説の勇者たち`,masterData:Ya,initialSceneId:`scene_ch6_start`,initialLocationId:`loc_danchi`,unlockFlag:`flag_ch5_cleared`,initialFlags:{flag_chapter:6,flag_chapter1_cleared:!0,flag_ch2_cleared:!0,flag_ch3_cleared:!0,flag_ch4_cleared:!0,flag_ch5_cleared:!0,flag_station_explored:!0,flag_visited_slope:!0,flag_ch3_museum_unlocked:!0}}];function Qa(){return(0,R.jsx)(Mt,{engines:{novel:Pt,maze_rpg:Tr,runner_action:bi,memory_game:$i,flash_calc:xa,spot_difference:Na,timing_game:Ua},initial:{engineId:`novel`,config:{masterData:Wa,assetsBaseUrl:Xa,chapterId:`chapter1`,initialSceneId:`scene_danchi_morning`,initialLocationId:`loc_danchi`,chapters:Za}},initialContext:{flags:{},inventory:[],playerStats:{}}})}(0,o.createRoot)(document.getElementById(`root`)).render((0,R.jsx)(a.StrictMode,{children:(0,R.jsx)(Qa,{})}));