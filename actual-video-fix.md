# Ocean continuity and section corrections

- Removed the derived ocean image and its backdrop layers. The animated journey contains no replacement image.
- The original video element now stays sticky behind the entire rising content entrance. Its scroll phase ends at the About arrival point; the actual video then holds its final frame.
- The seek endpoint now includes the final video frame. The entrance waits until that frame has decoded, rather than hiding a still-seeking video. Late completion catches up smoothly; reverse scrolling restores the video phase.
- Verified desktop video at 9.991/10 seconds and mobile at 9.991/10 seconds, within the last 24fps frame. Video opacity remains 1 and its top remains 0 during the entrance. Both MP4 files remain unchanged. A longer source is not needed for this transition.
- Reduced motion and media errors retain the existing accessible static fallback; those loading/fallback posters are not used as an animated exit backdrop.
- Challenge is now a full-width pale aquatic-blue field after ivory About. Ivory venue CTA now contrasts with the dark aquatic FAQ.
- Removed the decorative RIHS 2027 venue artwork and centered the remaining CTA. Header/footer brand logos remain.
- Registration and sponsor application sections are full width. Fixed their max-width versus viewport-padding conflict, which squeezed columns on large displays. At approximately 2525px, columns now measure about 531px and 584px. Mobile retains a single readable column.
- Fixed the orphaned FAQ/schedule punctuation by keeping periods inside their final word.

Checks: TypeScript, public build, preview build and project verify passed. Browser checks covered desktop/mobile video completion, reverse entrance, reduced motion, no image layers, 390px mobile application bands, 1440px section contrast and approximately 2525px wide application layouts. No horizontal overflow was observed. Event data, both videos and PDF hashes remain unchanged. No physical-device/Safari test is claimed.

No commit, push or deployment. Current local preview: http://127.0.0.1:5180/.
