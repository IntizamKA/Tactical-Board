"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

type Phase = "attack" | "defense";
type Orientation = "vertical" | "horizontal";

type Position = {
  x: number;
  y: number;
};

type PlayerRole =
  | "GK"
  | "LB"
  | "CB"
  | "RB"
  | "LWB"
  | "RWB"
  | "DMF"
  | "CMF"
  | "AMF"
  | "LMF"
  | "RMF"
  | "LWF"
  | "RWF"
  | "SS"
  | "CF";

type PlayingStyle =
  | "Offensive Goalkeeper"
  | "Defensive Goalkeeper"
  | "Build Up"
  | "Extra Frontman"
  | "Offensive Fullback"
  | "Fullback Finisher"
  | "Anchor Man"
  | "Orchestrator"
  | "Box-to-Box"
  | "Destroyer"
  | "Hole Player"
  | "Classic No. 10"
  | "Creative Playmaker"
  | "Cross Specialist"
  | "Roaming Flank"
  | "Prolific Winger"
  | "Deep-Lying Forward"
  | "Target Man"
  | "Fox in the Box"
  | "Dummy Runner"
  | "Goal Poacher";

type PlayerInstructions = {
  role: PlayerRole;
  style: PlayingStyle;
};

type Player = {
  id: number;
  number: number;
  name: string;
  position: Position;
  attack: PlayerInstructions;
  defense: PlayerInstructions;
};

type Formation = {
  name: string;
  positions: Record<number, Position>;
};

/*
|--------------------------------------------------------------------------
| FORMATIONS
|--------------------------------------------------------------------------
|
| Nomor 1-11 adalah IDENTITAS PEMAIN.
|
| 1  = GK
| 2  = RB / RWB
| 3  = LB / LWB
| 4  = CB
| 5  = CB
| 6  = DMF / CMF
| 7  = RMF / RWF
| 8  = CMF / AMF
| 9  = CF
| 10 = AMF / SS / CF
| 11 = LMF / LWF
|
| Formasi hanya mengatur POSISI.
| Pemain tidak pernah berubah identitas ketika formasi berubah.
|--------------------------------------------------------------------------
*/

const formations: Record<string, Formation> = {
  "4-3-3": {
    name: "4-3-3",

    positions: {
      1: { x: 50, y: 94 },

      2: { x: 88, y: 72 },
      4: { x: 60, y: 76 },
      5: { x: 40, y: 76 },
      3: { x: 12, y: 72 },

      6: { x: 30, y: 51 },
      8: { x: 50, y: 56 },
      10: { x: 70, y: 51 },

      11: { x: 16, y: 25 },
      9: { x: 50, y: 17 },
      7: { x: 84, y: 25 },
    },
  },

  "4-4-2": {
    name: "4-4-2",

    positions: {
      1: { x: 50, y: 94 },

      2: { x: 88, y: 72 },
      4: { x: 60, y: 76 },
      5: { x: 40, y: 76 },
      3: { x: 12, y: 72 },

      7: { x: 88, y: 51 },
      8: { x: 63, y: 50 },
      6: { x: 37, y: 50 },
      11: { x: 12, y: 51 },

      9: { x: 62, y: 23 },
      10: { x: 38, y: 23 },
    },
  },

  "4-2-3-1": {
    name: "4-2-3-1",

    positions: {
      1: { x: 50, y: 94 },

      2: { x: 88, y: 72 },
      4: { x: 60, y: 76 },
      5: { x: 40, y: 76 },
      3: { x: 12, y: 72 },

      6: { x: 38, y: 56 },
      8: { x: 62, y: 56 },

      11: { x: 17, y: 36 },
      10: { x: 50, y: 31 },
      7: { x: 83, y: 36 },

      9: { x: 50, y: 17 },
    },
  },

  "3-4-3": {
    name: "3-4-3",

    positions: {
      1: { x: 50, y: 94 },

      4: { x: 75, y: 75 },
      5: { x: 50, y: 78 },
      3: { x: 25, y: 75 },

      7: { x: 88, y: 52 },
      8: { x: 64, y: 49 },
      6: { x: 36, y: 49 },
      11: { x: 12, y: 52 },

      10: { x: 20, y: 25 },
      9: { x: 50, y: 17 },
      2: { x: 80, y: 25 },
    },
  },

  "3-5-2": {
    name: "3-5-2",

    positions: {
      1: { x: 50, y: 94 },

      4: { x: 75, y: 75 },
      5: { x: 50, y: 78 },
      3: { x: 25, y: 75 },

      7: { x: 90, y: 52 },
      8: { x: 70, y: 49 },
      6: { x: 50, y: 54 },
      10: { x: 30, y: 49 },
      11: { x: 10, y: 52 },

      9: { x: 62, y: 23 },
      2: { x: 38, y: 23 },
    },
  },

  "5-3-2": {
    name: "5-3-2",

    positions: {
      1: { x: 50, y: 94 },

      2: { x: 90, y: 70 },
      4: { x: 70, y: 76 },
      5: { x: 50, y: 78 },
      3: { x: 30, y: 76 },
      11: { x: 10, y: 70 },

      8: { x: 70, y: 51 },
      6: { x: 50, y: 54 },
      10: { x: 30, y: 51 },

      9: { x: 62, y: 23 },
      7: { x: 38, y: 23 },
    },
  },

  "5-4-1": {
    name: "5-4-1",

    positions: {
      1: { x: 50, y: 94 },

      2: { x: 90, y: 70 },
      4: { x: 70, y: 76 },
      5: { x: 50, y: 78 },
      3: { x: 30, y: 76 },
      11: { x: 10, y: 70 },

      7: { x: 88, y: 51 },
      8: { x: 63, y: 49 },
      6: { x: 37, y: 49 },
      10: { x: 12, y: 51 },

      9: { x: 50, y: 20 },
    },
  },
};

const formationOptions = Object.keys(formations);

/*
|--------------------------------------------------------------------------
| PLAYER ROLES
|--------------------------------------------------------------------------
*/

const roleOptions: PlayerRole[] = [
  "GK",
  "LB",
  "CB",
  "RB",
  "LWB",
  "RWB",
  "DMF",
  "CMF",
  "AMF",
  "LMF",
  "RMF",
  "LWF",
  "RWF",
  "SS",
  "CF",
];

/*
|--------------------------------------------------------------------------
| PLAYING STYLES
|--------------------------------------------------------------------------
*/

const playingStyleOptions: PlayingStyle[] = [
  "Offensive Goalkeeper",
  "Defensive Goalkeeper",

  "Build Up",
  "Extra Frontman",

  "Offensive Fullback",
  "Fullback Finisher",

  "Anchor Man",
  "Orchestrator",
  "Box-to-Box",
  "Destroyer",

  "Hole Player",
  "Classic No. 10",
  "Creative Playmaker",

  "Cross Specialist",
  "Roaming Flank",
  "Prolific Winger",

  "Deep-Lying Forward",
  "Target Man",
  "Fox in the Box",
  "Dummy Runner",
  "Goal Poacher",
];

/*
|--------------------------------------------------------------------------
| STORAGE
|--------------------------------------------------------------------------
*/

const STORAGE_KEY = "football-tactical-board-v5";

const FORMATION_ANIMATION_DURATION = 900;
const PHASE_ANIMATION_DURATION = 1300;

/*
|--------------------------------------------------------------------------
| INITIAL PLAYERS
|--------------------------------------------------------------------------
|
| number/id tidak berubah ketika formasi berganti.
|--------------------------------------------------------------------------
*/

const initialPlayers: Player[] = [
  {
    id: 1,
    number: 1,
    name: "GK",
    position: formations["4-3-3"].positions[1],
    attack: {
      role: "GK",
      style: "Offensive Goalkeeper",
    },
    defense: {
      role: "GK",
      style: "Defensive Goalkeeper",
    },
  },

  {
    id: 2,
    number: 2,
    name: "RB",
    position: formations["4-3-3"].positions[2],
    attack: {
      role: "RB",
      style: "Offensive Fullback",
    },
    defense: {
      role: "RB",
      style: "Offensive Fullback",
    },
  },

  {
    id: 3,
    number: 3,
    name: "LB",
    position: formations["4-3-3"].positions[3],
    attack: {
      role: "LB",
      style: "Offensive Fullback",
    },
    defense: {
      role: "LB",
      style: "Offensive Fullback",
    },
  },

  {
    id: 4,
    number: 4,
    name: "CB",
    position: formations["4-3-3"].positions[4],
    attack: {
      role: "CB",
      style: "Build Up",
    },
    defense: {
      role: "CB",
      style: "Build Up",
    },
  },

  {
    id: 5,
    number: 5,
    name: "CB",
    position: formations["4-3-3"].positions[5],
    attack: {
      role: "CB",
      style: "Build Up",
    },
    defense: {
      role: "CB",
      style: "Destroyer",
    },
  },

  {
    id: 6,
    number: 6,
    name: "DMF",
    position: formations["4-3-3"].positions[6],
    attack: {
      role: "DMF",
      style: "Anchor Man",
    },
    defense: {
      role: "DMF",
      style: "Anchor Man",
    },
  },

  {
    id: 7,
    number: 7,
    name: "RWF",
    position: formations["4-3-3"].positions[7],
    attack: {
      role: "RWF",
      style: "Prolific Winger",
    },
    defense: {
      role: "RWF",
      style: "Roaming Flank",
    },
  },

  {
    id: 8,
    number: 8,
    name: "CMF",
    position: formations["4-3-3"].positions[8],
    attack: {
      role: "CMF",
      style: "Orchestrator",
    },
    defense: {
      role: "CMF",
      style: "Box-to-Box",
    },
  },

  {
    id: 9,
    number: 9,
    name: "CF",
    position: formations["4-3-3"].positions[9],
    attack: {
      role: "CF",
      style: "Deep-Lying Forward",
    },
    defense: {
      role: "CF",
      style: "Dummy Runner",
    },
  },

  {
    id: 10,
    number: 10,
    name: "AMF",
    position: formations["4-3-3"].positions[10],
    attack: {
      role: "AMF",
      style: "Creative Playmaker",
    },
    defense: {
      role: "SS",
      style: "Dummy Runner",
    },
  },

  {
    id: 11,
    number: 11,
    name: "LWF",
    position: formations["4-3-3"].positions[11],
    attack: {
      role: "LWF",
      style: "Prolific Winger",
    },
    defense: {
      role: "LWF",
      style: "Roaming Flank",
    },
  },
];

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const clonePlayers = (players: Player[]): Player[] => {
  return players.map((player) => ({
    ...player,

    position: {
      ...player.position,
    },

    attack: {
      ...player.attack,
    },

    defense: {
      ...player.defense,
    },
  }));
};

const getPhaseColor = (phase: Phase) => {
  if (phase === "attack") {
    return {
      border: "border-blue-500",
      text: "text-blue-400",
      bg: "bg-blue-600",
      soft: "bg-blue-500/10",
      ring: "ring-blue-500/30",
    };
  }

  return {
    border: "border-red-500",
    text: "text-red-400",
    bg: "bg-red-600",
    soft: "bg-red-500/10",
    ring: "ring-red-500/30",
  };
};

/*
|--------------------------------------------------------------------------
| NORMALIZE STORAGE
|--------------------------------------------------------------------------
|
| Ini menjaga kompatibilitas jika localStorage masih menggunakan data
| versi sebelumnya.
|--------------------------------------------------------------------------
*/

const normalizePlayers = (
  storedPlayers: unknown,
  fallbackPlayers: Player[],
): Player[] => {
  if (!Array.isArray(storedPlayers)) {
    return clonePlayers(fallbackPlayers);
  }

  return fallbackPlayers.map((fallbackPlayer) => {
    const stored = storedPlayers.find(
      (item): item is Partial<Player> =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        Number(item.id) === fallbackPlayer.id,
    );

    if (!stored) {
      return {
        ...fallbackPlayer,
        position: {
          ...fallbackPlayer.position,
        },
      };
    }

    const storedPosition =
      stored.position &&
      typeof stored.position === "object" &&
      typeof stored.position.x === "number" &&
      typeof stored.position.y === "number"
        ? {
            x: stored.position.x,
            y: stored.position.y,
          }
        : {
            ...fallbackPlayer.position,
          };

    const storedAttack =
      stored.attack &&
      typeof stored.attack === "object" &&
      "role" in stored.attack &&
      "style" in stored.attack
        ? {
            role: stored.attack.role as PlayerRole,
            style: stored.attack.style as PlayingStyle,
          }
        : {
            ...fallbackPlayer.attack,
          };

    const storedDefense =
      stored.defense &&
      typeof stored.defense === "object" &&
      "role" in stored.defense &&
      "style" in stored.defense
        ? {
            role: stored.defense.role as PlayerRole,
            style: stored.defense.style as PlayingStyle,
          }
        : {
            ...fallbackPlayer.defense,
          };

    return {
      ...fallbackPlayer,

      name:
        typeof stored.name === "string"
          ? stored.name
          : fallbackPlayer.name,

      number: fallbackPlayer.number,

      position: storedPosition,

      attack: storedAttack,

      defense: storedDefense,
    };
  });
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function Home() {
  const [phase, setPhase] = useState<Phase>("attack");

  const [orientation, setOrientation] =
    useState<Orientation>("horizontal");

  const [attackFormation, setAttackFormation] =
    useState("4-3-3");

  const [defenseFormation, setDefenseFormation] =
    useState("4-4-2");

  const [attackPlayers, setAttackPlayers] =
    useState<Player[]>(() => clonePlayers(initialPlayers));

  const [defensePlayers, setDefensePlayers] = useState<Player[]>(() =>
    initialPlayers.map((player) => ({
      ...player,

      position: {
        ...formations["4-4-2"].positions[player.number],
      },
    })),
  );

  const [editMode, setEditMode] = useState(false);

  const [selectedPlayerId, setSelectedPlayerId] =
    useState<number | null>(null);

  const [draggingPlayerId, setDraggingPlayerId] =
    useState<number | null>(null);

  const [transitionPlayers, setTransitionPlayers] =
    useState<Player[] | null>(null);

  const [saved, setSaved] = useState(false);

  const pitchRef = useRef<HTMLDivElement | null>(null);

  const transitionFrameRef = useRef<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD STORAGE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return;
      }

      const data: unknown = JSON.parse(raw);

      if (!data || typeof data !== "object") {
        return;
      }

      const stored = data as {
        attackPlayers?: unknown;
        defensePlayers?: unknown;
        attackFormation?: unknown;
        defenseFormation?: unknown;
        orientation?: unknown;
      };

      setAttackPlayers(
        normalizePlayers(
          stored.attackPlayers,
          initialPlayers,
        ),
      );

      setDefensePlayers(
        normalizePlayers(
          stored.defensePlayers,
          initialPlayers.map((player) => ({
            ...player,
            position: {
              ...formations["4-4-2"].positions[player.number],
            },
          })),
        ),
      );

      if (
        typeof stored.attackFormation === "string" &&
        formations[stored.attackFormation]
      ) {
        setAttackFormation(stored.attackFormation);
      }

      if (
        typeof stored.defenseFormation === "string" &&
        formations[stored.defenseFormation]
      ) {
        setDefenseFormation(stored.defenseFormation);
      }

      if (
        stored.orientation === "vertical" ||
        stored.orientation === "horizontal"
      ) {
        setOrientation(stored.orientation);
      }
    } catch (error) {
      console.error(
        "Failed to load tactical board:",
        error,
      );
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CLEANUP
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (transitionFrameRef.current !== null) {
        cancelAnimationFrame(
          transitionFrameRef.current,
        );
      }
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CURRENT PLAYERS
  |--------------------------------------------------------------------------
  */

  const phasePlayers =
    phase === "attack"
      ? attackPlayers
      : defensePlayers;

  const players =
    transitionPlayers ?? phasePlayers;

  const selectedPlayer =
    phasePlayers.find(
      (player) =>
        player.id === selectedPlayerId,
    ) ?? null;

  /*
  |--------------------------------------------------------------------------
  | CURRENT FORMATION
  |--------------------------------------------------------------------------
  */

  const currentFormation =
    phase === "attack"
      ? attackFormation
      : defenseFormation;

  /*
  |--------------------------------------------------------------------------
  | UPDATE CURRENT PLAYERS
  |--------------------------------------------------------------------------
  */

  const updateCurrentPlayers = useCallback(
    (
      updater:
        | Player[]
        | ((players: Player[]) => Player[]),
    ) => {
      if (phase === "attack") {
        setAttackPlayers(updater);
      } else {
        setDefensePlayers(updater);
      }
    },
    [phase],
  );

  /*
  |--------------------------------------------------------------------------
  | POSITION FROM POINTER
  |--------------------------------------------------------------------------
  */

  const getPositionFromPointer = (
    clientX: number,
    clientY: number,
  ): Position | null => {
    const pitch = pitchRef.current;

    if (!pitch) {
      return null;
    }

    const rect =
      pitch.getBoundingClientRect();

    const rawX =
      ((clientX - rect.left) /
        rect.width) *
      100;

    const rawY =
      ((clientY - rect.top) /
        rect.height) *
      100;

    const clampedX = Math.max(
      3,
      Math.min(97, rawX),
    );

    const clampedY = Math.max(
      3,
      Math.min(97, rawY),
    );

    if (orientation === "vertical") {
      return {
        x: clampedX,
        y: clampedY,
      };
    }

    return {
      x: 100 - clampedY,
      y: clampedX,
    };
  };

  /*
  |--------------------------------------------------------------------------
  | PLAYER POINTER DOWN
  |--------------------------------------------------------------------------
  */

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
    playerId: number,
  ) => {
    if (transitionPlayers) {
      return;
    }

    event.preventDefault();

    setSelectedPlayerId(playerId);

    if (editMode) {
      setDraggingPlayerId(playerId);

      event.currentTarget.setPointerCapture(
        event.pointerId,
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PLAYER POINTER MOVE
  |--------------------------------------------------------------------------
  */

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      !editMode ||
      transitionPlayers ||
      draggingPlayerId === null
    ) {
      return;
    }

    const position =
      getPositionFromPointer(
        event.clientX,
        event.clientY,
      );

    if (!position) {
      return;
    }

    updateCurrentPlayers((current) =>
      current.map((player) =>
        player.id === draggingPlayerId
          ? {
              ...player,
              position,
            }
          : player,
      ),
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PLAYER POINTER UP
  |--------------------------------------------------------------------------
  */

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    setDraggingPlayerId(null);
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const saveSettings = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          attackPlayers,
          defensePlayers,
          attackFormation,
          defenseFormation,
          orientation,
        }),
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 1800);
    } catch (error) {
      console.error(
        "Failed to save tactical board:",
        error,
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const reset = () => {
    if (
      transitionFrameRef.current !== null
    ) {
      cancelAnimationFrame(
        transitionFrameRef.current,
      );

      transitionFrameRef.current = null;
    }

    setPhase("attack");

    setOrientation("horizontal");

    setAttackFormation("4-3-3");

    setDefenseFormation("4-4-2");

    setAttackPlayers(
      clonePlayers(initialPlayers),
    );

    setDefensePlayers(
      initialPlayers.map((player) => ({
        ...player,

        position: {
          ...formations["4-4-2"].positions[
            player.number
          ],
        },
      })),
    );

    setTransitionPlayers(null);

    setEditMode(false);

    setDraggingPlayerId(null);

    setSelectedPlayerId(null);

    localStorage.removeItem(
      STORAGE_KEY,
    );
  };

  /*
  |--------------------------------------------------------------------------
  | FORMATION ANIMATION
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Pemain dipindahkan berdasarkan player.number,
  | bukan berdasarkan index array.
  |--------------------------------------------------------------------------
  */

  const moveToFormation = (
    formationName: string,
  ) => {
    const formation =
      formations[formationName];

    if (!formation) {
      return;
    }

    const targetPlayers =
      phase === "attack"
        ? attackPlayers
        : defensePlayers;

    const startPlayers =
      clonePlayers(targetPlayers);

    const finalPlayers =
      targetPlayers.map((player) => {
        const targetPosition =
          formation.positions[
            player.number
          ];

        return {
          ...player,

          position: targetPosition
            ? {
                ...targetPosition,
              }
            : {
                ...player.position,
              },
        };
      });

    if (
      transitionFrameRef.current !== null
    ) {
      cancelAnimationFrame(
        transitionFrameRef.current,
      );
    }

    setSelectedPlayerId(null);

    setDraggingPlayerId(null);

    setTransitionPlayers(
      clonePlayers(startPlayers),
    );

    const startTime =
      performance.now();

    const animateFormation = (
      time: number,
    ) => {
      const progress = Math.min(
        (time - startTime) /
          FORMATION_ANIMATION_DURATION,
        1,
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      const nextPlayers =
        startPlayers.map((player) => {
          const target =
            finalPlayers.find(
              (item) =>
                item.number ===
                player.number,
            );

          if (!target) {
            return player;
          }

          return {
            ...player,

            position: {
              x:
                player.position.x +
                (target.position.x -
                  player.position.x) *
                  eased,

              y:
                player.position.y +
                (target.position.y -
                  player.position.y) *
                  eased,
            },
          };
        });

      setTransitionPlayers(
        nextPlayers,
      );

      if (progress < 1) {
        transitionFrameRef.current =
          requestAnimationFrame(
            animateFormation,
          );
      } else {
        updateCurrentPlayers(
          finalPlayers,
        );

        setTransitionPlayers(
          null,
        );

        transitionFrameRef.current =
          null;
      }
    };

    transitionFrameRef.current =
      requestAnimationFrame(
        animateFormation,
      );
  };

  /*
  |--------------------------------------------------------------------------
  | FORMATION CHANGE
  |--------------------------------------------------------------------------
  */

  const changeAttackFormation = (
    value: string,
  ) => {
    setAttackFormation(value);

    if (phase === "attack") {
      moveToFormation(value);
    }
  };

  const changeDefenseFormation = (
    value: string,
  ) => {
    setDefenseFormation(value);

    if (phase === "defense") {
      moveToFormation(value);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PHASE TRANSITION
  |--------------------------------------------------------------------------
  */

  const changePhase = (
    newPhase: Phase,
  ) => {
    if (newPhase === phase) {
      return;
    }

    if (
      transitionFrameRef.current !== null
    ) {
      cancelAnimationFrame(
        transitionFrameRef.current,
      );

      transitionFrameRef.current =
        null;
    }

    setEditMode(false);

    setDraggingPlayerId(null);

    setSelectedPlayerId(null);

    const sourcePlayers =
      phase === "attack"
        ? attackPlayers
        : defensePlayers;

    const targetPlayers =
      newPhase === "attack"
        ? attackPlayers
        : defensePlayers;

    const startPlayers =
      clonePlayers(sourcePlayers);

    const endPlayers =
      clonePlayers(targetPlayers);

    setPhase(newPhase);

    setTransitionPlayers(
      clonePlayers(startPlayers),
    );

    const startTime =
      performance.now();

    const animateTransition = (
      time: number,
    ) => {
      const progress = Math.min(
        (time - startTime) /
          PHASE_ANIMATION_DURATION,
        1,
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      const nextPlayers =
        startPlayers.map((player) => {
          const target =
            endPlayers.find(
              (item) =>
                item.number ===
                player.number,
            );

          if (!target) {
            return player;
          }

          return {
            ...player,

            position: {
              x:
                player.position.x +
                (target.position.x -
                  player.position.x) *
                  eased,

              y:
                player.position.y +
                (target.position.y -
                  player.position.y) *
                  eased,
            },
          };
        });

      setTransitionPlayers(
        nextPlayers,
      );

      if (progress < 1) {
        transitionFrameRef.current =
          requestAnimationFrame(
            animateTransition,
          );
      } else {
        setTransitionPlayers(
          null,
        );

        transitionFrameRef.current =
          null;
      }
    };

    transitionFrameRef.current =
      requestAnimationFrame(
        animateTransition,
      );
  };

  /*
  |--------------------------------------------------------------------------
  | PLAYER EDITING
  |--------------------------------------------------------------------------
  */

  const updateSelectedPlayer = (
    updater: (player: Player) => Player,
  ) => {
    if (
      selectedPlayerId === null ||
      transitionPlayers
    ) {
      return;
    }

    updateCurrentPlayers((current) =>
      current.map((player) =>
        player.id === selectedPlayerId
          ? updater(player)
          : player,
      ),
    );
  };

  const updateRole = (
    role: PlayerRole,
  ) => {
    updateSelectedPlayer(
      (player) => ({
        ...player,

        name: role,

        [phase]: {
          ...player[phase],
          role,
        },
      }),
    );
  };

  const updatePlayingStyle = (
    style: PlayingStyle,
  ) => {
    updateSelectedPlayer(
      (player) => ({
        ...player,

        [phase]: {
          ...player[phase],
          style,
        },
      }),
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER POSITION
  |--------------------------------------------------------------------------
  */

  const getRenderedPosition = (
    position: Position,
  ) => {
    if (
      orientation === "vertical"
    ) {
      return {
        left: position.x,
        top: position.y,
      };
    }

    return {
      left: position.y,
      top: 100 - position.x,
    };
  };

  const colors =
    getPhaseColor(phase);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 sm:py-8">
      {/* HEADER */}

      <div className="mx-auto mb-6 flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            aria-label="Back to home"
          >
            <span className="text-lg transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
          </Link>

          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Tactical Board
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Football Formation
              Simulator
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* ORIENTATION */}

          <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-1">
            <button
              type="button"
              onClick={() =>
                setOrientation(
                  "vertical",
                )
              }
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                orientation ===
                "vertical"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ↕ Vertical
            </button>

            <button
              type="button"
              onClick={() =>
                setOrientation(
                  "horizontal",
                )
              }
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                orientation ===
                "horizontal"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ↔ Horizontal
            </button>
          </div>

          {/* EDIT */}

          <button
            type="button"
            disabled={
              !!transitionPlayers
            }
            onClick={() => {
              if (transitionPlayers) {
                return;
              }

              setEditMode(
                (value) => !value,
              );

              setDraggingPlayerId(
                null,
              );

              setSelectedPlayerId(
                null,
              );
            }}
            className={`rounded-lg border px-4 py-2.5 text-sm font-bold transition ${
              editMode
                ? "border-yellow-500 bg-yellow-500 text-black"
                : "border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {editMode
              ? "✋ Editing"
              : "✋ Edit Position"}
          </button>

          {/* SAVE */}

          <button
            type="button"
            onClick={saveSettings}
            disabled={
              !!transitionPlayers
            }
            className="rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saved
              ? "✓ Saved"
              : "Save"}
          </button>

          {/* RESET */}

          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Reset
          </button>
        </div>
      </div>

      {/* EDIT INFO */}

      {editMode && (
        <div className="mx-auto mb-6 max-w-7xl rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-4">
          <p className="text-sm font-bold text-yellow-400">
            EDIT MODE ACTIVE
          </p>

          <p className="mt-1 text-xs leading-5 text-yellow-200/70">
            Klik pemain untuk memilih
            dan mengubah posisi/role
            serta playing style. Kamu
            juga bisa drag pemain
            langsung di pitch untuk
            mengubah posisi fisiknya.
          </p>
        </div>
      )}

      {/* CONTROL PANEL */}

      <div className="mx-auto mb-6 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2">
        {/* PHASE */}

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Tactical Phase
          </p>

          <div className="flex rounded-lg bg-black p-1">
            <button
              type="button"
              onClick={() =>
                changePhase(
                  "attack",
                )
              }
              className={`flex-1 rounded-md py-2.5 text-sm font-bold transition ${
                phase === "attack"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              ⚔ Attack
            </button>

            <button
              type="button"
              onClick={() =>
                changePhase(
                  "defense",
                )
              }
              className={`flex-1 rounded-md py-2.5 text-sm font-bold transition ${
                phase === "defense"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              🛡 Defense
            </button>
          </div>
        </div>

        {/* FORMATION */}

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
            {phase === "attack"
              ? "Attacking Formation"
              : "Defensive Formation"}
          </p>

          <select
            value={
              currentFormation
            }
            onChange={(event) => {
              if (
                phase ===
                "attack"
              ) {
                changeAttackFormation(
                  event.target
                    .value,
                );
              } else {
                changeDefenseFormation(
                  event.target
                    .value,
                );
              }
            }}
            disabled={
              !!transitionPlayers
            }
            className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2.5 font-bold text-white outline-none transition focus:border-zinc-500 disabled:opacity-40"
          >
            {formationOptions.map(
              (formation) => (
                <option
                  key={formation}
                  value={
                    formation
                  }
                >
                  {formation}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      {/* PITCH + EDITOR */}

      <div
        className={`mx-auto flex max-w-7xl gap-6 ${
          orientation ===
          "vertical"
            ? "flex-col xl:flex-row xl:items-start xl:justify-center"
            : "flex-col"
        }`}
      >
        {/* PITCH */}

        <div
          className={`flex justify-center ${
            orientation ===
            "vertical"
              ? "xl:flex-1"
              : "w-full"
          }`}
        >
          <div
            ref={pitchRef}
            onPointerMove={
              handlePointerMove
            }
            className={`
              relative
              overflow-hidden
              rounded-xl
              border-[3px]
              border-zinc-800
              bg-[#16803c]
              shadow-2xl
              transition-all
              duration-500
              ${
                orientation ===
                "vertical"
                  ? "aspect-[2/3] w-full max-w-[620px]"
                  : "aspect-[3/2] w-full max-w-[1050px]"
              }
            `}
          >
            {/* PITCH BORDER */}

            <div className="absolute inset-[4%] border-2 border-white/90" />

            {/* CENTER LINE */}

            <div
              className={
                orientation ===
                "vertical"
                  ? "absolute left-[4%] right-[4%] top-1/2 h-[2px] bg-white/90"
                  : "absolute bottom-[4%] top-[4%] left-1/2 w-[2px] bg-white/90"
              }
            />

            {/* CENTER CIRCLE */}

            <div className="absolute left-1/2 top-1/2 aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/90" />

            {/* CENTER DOT */}

            <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

            {/* PENALTY AREAS */}

            {orientation ===
            "vertical" ? (
              <>
                <div className="absolute left-[25%] right-[25%] top-[4%] h-[18%] border-2 border-white/90" />

                <div className="absolute left-[38%] right-[38%] top-[4%] h-[7%] border-2 border-white/90" />

                <div className="absolute bottom-[4%] left-[25%] right-[25%] h-[18%] border-2 border-white/90" />

                <div className="absolute bottom-[4%] left-[38%] right-[38%] h-[7%] border-2 border-white/90" />
              </>
            ) : (
              <>
                <div className="absolute bottom-[25%] left-[4%] top-[25%] w-[18%] border-2 border-white/90" />

                <div className="absolute bottom-[38%] left-[4%] top-[38%] w-[7%] border-2 border-white/90" />

                <div className="absolute bottom-[25%] right-[4%] top-[25%] w-[18%] border-2 border-white/90" />

                <div className="absolute bottom-[38%] right-[4%] top-[38%] w-[7%] border-2 border-white/90" />
              </>
            )}

            {/* PLAYERS */}

            {players.map(
              (player) => {
                const rendered =
                  getRenderedPosition(
                    player.position,
                  );

                const isDragging =
                  draggingPlayerId ===
                  player.id;

                const isSelected =
                  selectedPlayerId ===
                  player.id;

                const instructions =
                  player[phase];

                return (
                  <div
                    key={player.id}
                    className={`
                      absolute
                      -translate-x-1/2
                      -translate-y-1/2
                      select-none
                      ${
                        editMode &&
                        !transitionPlayers
                          ? "cursor-grab active:cursor-grabbing"
                          : "cursor-pointer"
                      }
                    `}
                    style={{
                      left: `${rendered.left}%`,
                      top: `${rendered.top}%`,
                      zIndex:
                        isDragging ||
                        isSelected
                          ? 50
                          : 10,
                    }}
                    onPointerDown={(
                      event,
                    ) =>
                      handlePointerDown(
                        event,
                        player.id,
                      )
                    }
                    onPointerUp={
                      handlePointerUp
                    }
                  >
                    {/* SHADOW */}

                    <div
                      className={`
                        absolute
                        left-1/2
                        top-1/2
                        h-14
                        w-14
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-black/30
                        blur-sm
                        ${
                          isDragging
                            ? "scale-125"
                            : ""
                        }
                      `}
                    />

                    {/* SELECTION RING */}

                    {isSelected && (
                      <div
                        className={`
                          absolute
                          left-1/2
                          top-1/2
                          h-[70px]
                          w-[70px]
                          -translate-x-1/2
                          -translate-y-1/2
                          rounded-full
                          border-2
                          border-dashed
                          ${
                            phase ===
                            "attack"
                              ? "border-blue-300"
                              : "border-red-300"
                          }
                          animate-pulse
                        `}
                      />
                    )}

                    {/* PLAYER */}

                    <div
                      className={`
                        relative
                        flex
                        h-12
                        w-12
                        flex-col
                        items-center
                        justify-center
                        rounded-full
                        border-[3px]
                        bg-white
                        shadow-xl
                        transition-transform
                        duration-150
                        ${
                          phase ===
                          "attack"
                            ? "border-blue-500"
                            : "border-red-500"
                        }
                        ${
                          isDragging
                            ? "scale-110"
                            : isSelected
                              ? "scale-105"
                              : "scale-100"
                        }
                      `}
                    >
                      <span
                        className={`
                          text-[15px]
                          leading-none
                          font-black
                          ${
                            phase ===
                            "attack"
                              ? "text-blue-600"
                              : "text-red-600"
                          }
                        `}
                      >
                        {player.number}
                      </span>

                      <span
                        className={`
                          mt-0.5
                          text-[7px]
                          leading-none
                          font-black
                          ${
                            phase ===
                            "attack"
                              ? "text-blue-600"
                              : "text-red-600"
                          }
                        `}
                      >
                        {
                          instructions.role
                        }
                      </span>
                    </div>

                    {/* PLAYER LABEL */}

                    {editMode &&
                      !transitionPlayers && (
                        <div className="absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-[9px] font-bold text-white shadow-lg">
                          #{player.number}{" "}
                          ·{" "}
                          {
                            instructions.style
                          }
                        </div>
                      )}
                  </div>
                );
              },
            )}

            {/* TRANSITION STATUS */}

            {transitionPlayers && (
              <div className="absolute left-1/2 top-6 z-[100] -translate-x-1/2 rounded-full bg-black/80 px-5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur">
                TRANSITIONING...
              </div>
            )}

            {/* EDIT STATUS */}

            {editMode &&
              !transitionPlayers && (
                <div className="absolute bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-yellow-500/30 bg-black/80 px-5 py-2 text-xs font-bold text-yellow-400 shadow-lg backdrop-blur">
                  {selectedPlayer
                    ? `PLAYER #${selectedPlayer.number} SELECTED`
                    : "CLICK PLAYER TO EDIT"}
                </div>
              )}
          </div>
        </div>

        {/* PLAYER EDITOR */}

        {editMode && (
          <aside
            className={`
              ${
                orientation ===
                "vertical"
                  ? "w-full xl:w-[380px]"
                  : "mx-auto w-full max-w-[1050px]"
              }
            `}
          >
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl">
              {/* EDITOR HEADER */}

              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Player Editor
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    {selectedPlayer
                      ? `#${selectedPlayer.number} ${selectedPlayer.name}`
                      : "Select Player"}
                  </h2>

                  {selectedPlayer && (
                    <p className="mt-1 text-xs text-zinc-500">
                      Edit instructions
                      untuk fase{" "}
                      <span
                        className={
                          phase ===
                          "attack"
                            ? "font-bold text-blue-400"
                            : "font-bold text-red-400"
                        }
                      >
                        {phase ===
                        "attack"
                          ? "ATTACK"
                          : "DEFENSE"}
                      </span>
                    </p>
                  )}
                </div>

                <div
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold ${colors.soft} ${colors.text}`}
                >
                  {phase.toUpperCase()}
                </div>
              </div>

              {selectedPlayer ? (
                <>
                  {/* PLAYER PREVIEW */}

                  <div
                    className={`mb-5 rounded-xl border ${colors.border}/30 ${colors.soft} p-4`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-4 bg-white ${
                          phase ===
                          "attack"
                            ? "border-blue-500"
                            : "border-red-500"
                        }`}
                      >
                        <span
                          className={`text-xl leading-none font-black ${
                            phase ===
                            "attack"
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {
                            selectedPlayer.number
                          }
                        </span>

                        <span
                          className={`mt-1 text-[8px] font-black ${
                            phase ===
                            "attack"
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {
                            selectedPlayer[
                              phase
                            ].role
                          }
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          Jersey Number
                        </p>

                        <p className="mt-1 text-2xl font-black text-white">
                          #
                          {
                            selectedPlayer.number
                          }
                        </p>

                        <p
                          className={`mt-1 text-xs font-semibold ${colors.text}`}
                        >
                          {
                            selectedPlayer[
                              phase
                            ].style
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PHASE SWITCH */}

                  <div className="mb-5 rounded-lg border border-zinc-800 bg-black p-1">
                    <button
                      type="button"
                      onClick={() =>
                        changePhase(
                          "attack",
                        )
                      }
                      className={`w-1/2 rounded-md py-2 text-xs font-bold transition ${
                        phase ===
                        "attack"
                          ? "bg-blue-600 text-white"
                          : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      ⚔ Attack
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        changePhase(
                          "defense",
                        )
                      }
                      className={`w-1/2 rounded-md py-2 text-xs font-bold transition ${
                        phase ===
                        "defense"
                          ? "bg-red-600 text-white"
                          : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      🛡 Defense
                    </button>
                  </div>

                  {/* JERSEY NUMBER INFO */}

                  <div className="mb-5 rounded-lg border border-zinc-800 bg-black/50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                      Classic Jersey Number
                    </p>

                    <p className="mt-2 text-3xl font-black text-white">
                      #
                      {
                        selectedPlayer.number
                      }
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Nomor punggung
                      digunakan sebagai
                      identitas pemain
                      ketika berganti
                      formasi.
                    </p>
                  </div>

                  {/* ROLE */}

                  <div className="mb-5">
                    <label
                      htmlFor="player-role"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500"
                    >
                      Position / Role
                    </label>

                    <select
                      id="player-role"
                      value={
                        selectedPlayer[
                          phase
                        ].role
                      }
                      onChange={(event) =>
                        updateRole(
                          event.target
                            .value as PlayerRole,
                        )
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm font-bold text-white outline-none transition hover:border-zinc-600 focus:border-zinc-400"
                    >
                      {roleOptions.map(
                        (role) => (
                          <option
                            key={role}
                            value={role}
                          >
                            {role}
                          </option>
                        ),
                      )}
                    </select>

                    <p className="mt-2 text-[10px] leading-4 text-zinc-600">
                      Contoh: CF, SS, AMF,
                      CMF, DMF, CB, LB,
                      RB, LWF, RWF, LMF,
                      RMF.
                    </p>
                  </div>

                  {/* PLAYING STYLE */}

                  <div className="mb-5">
                    <label
                      htmlFor="player-style"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500"
                    >
                      Playing Style
                    </label>

                    <select
                      id="player-style"
                      value={
                        selectedPlayer[
                          phase
                        ].style
                      }
                      onChange={(event) =>
                        updatePlayingStyle(
                          event.target
                            .value as PlayingStyle,
                        )
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm font-bold text-white outline-none transition hover:border-zinc-600 focus:border-zinc-400"
                    >
                      {playingStyleOptions.map(
                        (style) => (
                          <option
                            key={style}
                            value={style}
                          >
                            {style}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* BOTH PHASES */}

                  <div className="border-t border-zinc-800 pt-5">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                      Player Instructions
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          changePhase(
                            "attack",
                          )
                        }
                        className={`rounded-lg border p-3 text-left transition ${
                          phase ===
                          "attack"
                            ? "border-blue-500/50 bg-blue-500/10"
                            : "border-zinc-800 bg-black/40 hover:border-zinc-700"
                        }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          ⚔ Attack
                        </p>

                        <p className="mt-2 text-sm font-black text-white">
                          {
                            selectedPlayer
                              .attack
                              .role
                          }
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-zinc-500">
                          {
                            selectedPlayer
                              .attack
                              .style
                          }
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          changePhase(
                            "defense",
                          )
                        }
                        className={`rounded-lg border p-3 text-left transition ${
                          phase ===
                          "defense"
                            ? "border-red-500/50 bg-red-500/10"
                            : "border-zinc-800 bg-black/40 hover:border-zinc-700"
                        }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                          🛡 Defense
                        </p>

                        <p className="mt-2 text-sm font-black text-white">
                          {
                            selectedPlayer
                              .defense
                              .role
                          }
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-zinc-500">
                          {
                            selectedPlayer
                              .defense
                              .style
                          }
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* CLOSE SELECTION */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPlayerId(
                        null,
                      )
                    }
                    className="mt-5 w-full rounded-lg border border-zinc-800 bg-black px-4 py-2.5 text-xs font-bold text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                  >
                    Clear Selection
                  </button>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-700 bg-black/40 px-6 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-2xl">
                    ⚽
                  </div>

                  <p className="mt-4 text-sm font-bold text-zinc-300">
                    Pilih pemain di
                    pitch
                  </p>

                  <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-zinc-600">
                    Klik salah satu
                    pemain untuk
                    membuka editor
                    posisi dan
                    playing style.
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ALL PLAYER INSTRUCTIONS */}

      <div className="mx-auto mt-6 max-w-7xl">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Tactical Instructions
            </p>

            <p className="mt-1 text-sm text-zinc-600">
              Nomor punggung menjadi
              identitas tetap pemain.
              Role dan playing style
              dapat berbeda untuk
              Attack dan Defense.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {phasePlayers.map(
              (player) => (
                <button
                  type="button"
                  key={player.id}
                  onClick={() => {
                    if (!editMode) {
                      return;
                    }

                    setSelectedPlayerId(
                      player.id,
                    );

                    window.setTimeout(
                      () => {
                        const editor =
                          document.getElementById(
                            "player-role",
                          );

                        editor?.scrollIntoView(
                          {
                            behavior:
                              "smooth",
                            block:
                              "center",
                          },
                        );
                      },
                      50,
                    );
                  }}
                  className={`rounded-lg border bg-black/40 p-4 text-left transition ${
                    selectedPlayerId ===
                    player.id
                      ? `${colors.border} ${colors.soft}`
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-black text-white">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${
                          phase ===
                          "attack"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {
                          player.number
                        }
                      </span>

                      {
                        player[
                          phase
                        ].role
                      }
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-bold ${colors.soft} ${colors.text}`}
                    >
                      {phase.toUpperCase()}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-bold text-zinc-300">
                    {
                      player[
                        phase
                      ].style
                    }
                  </p>

                  <div className="mt-3 border-t border-zinc-800 pt-3">
                    <p className="text-[10px] text-zinc-600">
                      Attack:
                    </p>

                    <p className="text-[10px] text-zinc-500">
                      {
                        player.attack
                          .role
                      }{" "}
                      ·{" "}
                      {
                        player.attack
                          .style
                      }
                    </p>

                    <p className="mt-2 text-[10px] text-zinc-600">
                      Defense:
                    </p>

                    <p className="text-[10px] text-zinc-500">
                      {
                        player
                          .defense
                          .role
                      }{" "}
                      ·{" "}
                      {
                        player
                          .defense
                          .style
                      }
                    </p>
                  </div>
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* STATUS */}

      <div className="mx-auto mt-6 max-w-7xl">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-black text-white">
                {currentFormation}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {phase ===
                "attack"
                  ? "Attacking shape"
                  : "Defensive shape"}{" "}
                → Fluid transition
                enabled
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                Saat{" "}
                <strong>
                  {phase.toUpperCase()}
                </strong>{" "}
                aktif, setiap pemain
                menggunakan role dan
                playing style khusus
                untuk fase tersebut.
              </p>
            </div>

            <div
              className={`rounded-full px-4 py-2 text-xs font-bold ${colors.soft} ${colors.text}`}
            >
              {phase === "attack"
                ? "ATTACK"
                : "DEFENSE"}
            </div>
          </div>
        </div>
      </div>

      {/* JERSEY NUMBER INFO */}

      <div className="mx-auto mt-4 max-w-7xl">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Classic Jersey Number
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
            {initialPlayers.map(
              (player) => (
                <div
                  key={player.number}
                  className="rounded-lg bg-zinc-900 px-3 py-3 text-center"
                >
                  <p className="text-xl font-black text-white">
                    {player.number}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase text-zinc-600">
                    {
                      player.name
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* RULE INFO */}

      <div className="mx-auto mt-4 max-w-7xl">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Tactical Rules
          </p>

          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              Jersey Number 1–11
            </span>

            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              Jersey number = Player ID
            </span>

            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              CB maximum: 3
            </span>

            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              CF maximum: 2
            </span>

            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              Attack / Defense independent
              positions
            </span>

            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              Attack / Defense independent
              roles
            </span>

            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              Attack / Defense independent
              playing styles
            </span>

            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              Formation berdasarkan nomor
              punggung
            </span>

            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              Fluid transition enabled
            </span>

            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-zinc-400">
              LocalStorage enabled
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
