import cv2 as cv
import numpy as np

# โหลดภาพ
frame = cv.imread("get_data_for_train/img/tile_R00_C02.png")

# ตัวแปรตำแหน่งที่คลิก
click_x, click_y = -1, -1
show_once = False

# เก็บค่า mark ที่บันทึกจากปุ่ม Q
saved_marks = []

def nothing(x):
    pass

# Mouse callback ที่หน้าต่าง Result
def mouse_click(event, x, y, flags, param):
    global click_x, click_y, show_once
    if event == cv.EVENT_LBUTTONDOWN:
        click_x, click_y = x, y
        show_once = True    # ให้แสดงค่าสีครั้งเดียว


# Trackbars
cv.namedWindow("HSV Control")
cv.createTrackbar("Min_H", "HSV Control", 0, 179, nothing)
cv.createTrackbar("Max_H", "HSV Control", 179, 179, nothing)
cv.createTrackbar("Min_S", "HSV Control", 0, 255, nothing)
cv.createTrackbar("Max_S", "HSV Control", 255, 255, nothing)
cv.createTrackbar("Min_V", "HSV Control", 0, 255, nothing)
cv.createTrackbar("Max_V", "HSV Control", 255, 255, nothing)

# หน้าต่าง Result ที่ให้คลิก
cv.namedWindow("Result")
cv.setMouseCallback("Result", mouse_click)

while True:
    hsv = cv.cvtColor(frame, cv.COLOR_BGR2HSV)

    # อ่านค่าจาก Trackbars
    LH = cv.getTrackbarPos("Min_H", "HSV Control")
    HH = cv.getTrackbarPos("Max_H", "HSV Control")
    LS = cv.getTrackbarPos("Min_S", "HSV Control")
    HS = cv.getTrackbarPos("Max_S", "HSV Control")
    LV = cv.getTrackbarPos("Min_V", "HSV Control")
    HV = cv.getTrackbarPos("Max_V", "HSV Control")

    lower = np.array([LH, LS, LV])
    upper = np.array([HH, HS, HV])

    mask = cv.inRange(hsv, lower, upper)
    result = cv.bitwise_and(frame, frame, mask=mask)

    display_result = result.copy()

    # หากคลิก → แสดงค่าสีครั้งเดียว
    if show_once:
        b, g, r = frame[click_y, click_x]
        h, s, v = hsv[click_y, click_x]

        text = f"BGR({b},{g},{r})  HSV({h},{s},{v})"
        cv.putText(display_result, text, (10, 30),
                   cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        print("[CLICK] ", text)

        show_once = False    # แสดงครั้งเดียวเท่านั้น

    # แสดงภาพ
    cv.imshow("Original", frame)
    cv.imshow("Mask", mask)
    cv.imshow("Result", display_result)

    key = cv.waitKey(1) & 0xFF

    # บันทึกค่าสีด้วยปุ่ม Q
    if key == ord('q'):
        if click_x != -1:
            b, g, r = frame[click_y, click_x]
            h, s, v = hsv[click_y, click_x]
            saved_marks.append((b, g, r, h, s, v))
            print(f"[SAVE] Mark saved #{len(saved_marks)} → BGR({b},{g},{r}), HSV({h},{s},{v})")
        else:
            print("[WARN] ยังไม่คลิกตำแหน่งบน Result")

    # ปิดโปรแกรมด้วยปุ่ม /
    if key == ord('/'):

        if len(saved_marks) == 0:
            print("No saved marks.")
            break

    # ดึงเฉพาะค่า HSV จาก saved_marks
        hsv_list = [(h, s, v) for (_, _, _, h, s, v) in saved_marks]

        # แยกค่า H S V ออกมาหาค่าต่ำสุด/สูงสุด
        H_vals = [h for (h, _, _) in hsv_list]
        S_vals = [s for (_, s, _) in hsv_list]
        V_vals = [v for (_, _, v) in hsv_list]

        lower_h = min(H_vals)
        lower_s = min(S_vals)
        lower_v = min(V_vals)

        upper_h = max(H_vals)
        upper_s = max(S_vals)
        upper_v = max(V_vals)

        print(f"lower = np.array([{lower_h}, {lower_s}, {lower_v}])")
        print(f"upper = np.array([{upper_h}, {upper_s}, {upper_v}])")

cv.destroyAllWindows()
