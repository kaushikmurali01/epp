import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import {
  clearNotificationsAction,
  fetchUnreadNotifications,
  markAsReadNotification,
} from "../../redux/global/actions/exportFileAction";
import NotificationsToast from "utils/notification/NotificationsToast";
import Loader from "pages/Loader";

const NotificationPopup = ({
  showNotificationPopup,
  closeNotificationModal,
}) => {
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [localNotifications, setLocalNotifications] = useState([]);

  const userData = useSelector(
    (state) => state?.facilityReducer?.userDetails || {}
  );
  const notificationData = useSelector(
    (state) => state?.exportFileReducer?.notification_data
  );
  const popupLoading = useSelector(
    (state) => state?.exportFileReducer?.loading
  );

  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  const handleDownload = async (notification) => {
    if (!notification.file_path) {
      return;
    }
    try {
      // Start download
      const link = document.createElement("a");
      link.href = notification.file_path;
      link.target = "_self";
      link.download =
        notification.file_path.split("/").pop() || "downloaded_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show notification
      NotificationsToast({
        message: "Downloading started...",
        type: "success",
      });
      const readNotificationObj = {
        record_id: notification.id,
        facility_id: notification.facility_id,
        file_path: notification.file_path,
      };
      // Mark notification as read
      dispatch(markAsReadNotification(readNotificationObj)).then(() => {
        closeNotificationModal();
      });
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to start download. Please try again.");
    }
  };

  // Initial data fetch and setting local notifications
  useEffect(() => {
    if (userData?.user?.id) {
      setLoading(true);
      dispatch(
        fetchUnreadNotifications(
          userData.user.id,
          pageInfo.pageSize,
          pageInfo.page
        )
      ).then(() => {
        setLoading(false);
      });
    }
  }, [showNotificationPopup, userData?.user?.id]);

  // Update local notifications when new data arrives
  useEffect(() => {
    if (notificationData?.data) {
      if (pageInfo.page === 1) {
        // Reset list for first page
        setLocalNotifications(notificationData.data);
      } else {
        // Append new notifications for subsequent pages
        setLocalNotifications((prev) => {
          // Create a Set of existing IDs to prevent duplicates
          const existingIds = new Set(prev.map((note) => note.id));
          const newNotifications = notificationData.data.filter(
            (note) => !existingIds.has(note.id)
          );
          return [...prev, ...newNotifications];
        });
      }
    }
  }, [notificationData, pageInfo.page]);

  // Improved scroll handler with IntersectionObserver
  useEffect(() => {
    if (!contentRef.current || !hasMore) return;

    const options = {
      root: contentRef.current,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore) {
        setPageInfo((prev) => ({ ...prev, page: prev.page + 1 }));
      }
    }, options);

    // Create and observe a sentinel element
    const sentinel = document.createElement("div");
    sentinel.style.height = "1px";
    contentRef.current.appendChild(sentinel);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [loading, hasMore]);

  // Fetch more data when page changes
  useEffect(() => {
    if (pageInfo.page > 1 && !loading && hasMore) {
      setLoading(true);
      dispatch(
        fetchUnreadNotifications(
          userData?.user?.id,
          pageInfo.pageSize,
          pageInfo.page
        )
      ).then((response) => {
        if (response?.data?.length < pageInfo.pageSize) {
          setHasMore(false);
        }
        setLoading(false);
      });
    }
  }, [pageInfo.page, userData?.user?.id]);

  // Reset state when popup closes
  useEffect(() => {
    if (!showNotificationPopup) {
      setPageInfo({ page: 1, pageSize: 10 });
      setHasMore(true);
      setLocalNotifications([]);
    }
  }, [showNotificationPopup]);

  return (
    <Dialog
      open={showNotificationPopup}
      onClose={closeNotificationModal}
      maxWidth="sm"
      fullWidth
    >
      <Typography variant="h5" color="primary" sx={{ p: 2 }}>
        Notification
      </Typography>
      <DialogContent
        dividers
        ref={contentRef}
        sx={{
          minHeight: "300px",
          maxHeight: "400px",
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
      >
        <List>
          {localNotifications.map((notification) => (
            <ListItem
              disableGutters
              key={notification.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Typography variant="body2" sx={{ flex: 1 }}>
                {notification.message} of facility {notification.facility_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  ml: 2,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={() => handleDownload(notification)}
              >
                Download
              </Typography>
            </ListItem>
          ))}
          {loading && (
            <ListItem>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Loading more...
              </Typography>
            </ListItem>
          )}
          {!hasMore && localNotifications.length > 10 && (
            <ListItem>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                No more notifications
              </Typography>
            </ListItem>
          )}
          {!loading && localNotifications.length === 0 && (
            <ListItem>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                No notifications found
              </Typography>
            </ListItem>
          )}
        </List>
      </DialogContent>
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={popupLoading}
        loaderPosition="fixed"
      />
    </Dialog>
  );
};

export default NotificationPopup;
